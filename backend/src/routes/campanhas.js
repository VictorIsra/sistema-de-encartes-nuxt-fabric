const axios = require('axios')
const express = require('express')
const Campanha = require('../models/campanha')
const filterInput = require('../middleware/filterInput')//filtro body pra tirar o campo '_id'
//n preciso do router.use express json pq ja o fiz no index.js
//td necessario pro upload d imgs
const multer = require('multer')//p faze uploado da img pra um folder
const fs = require('fs')//p deletar a img de um folder ( path)
const crypto = require('crypto')
const path = require('path')

const router = new express.Router()

const storage = multer.diskStorage({
    destination: 'static/uploads/fotos',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
        //p salvar o path com formato correto
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
  })

const upload = multer({ storage: storage })

router.post('/campanhas/removeImg',(req,res)=>{
    console.log("entrei deleta img, req.body: ",req.body)
    const path = req.body.path//path q usarei pra salvar pro bd, inclusive 
   
    fs.unlink(path,(err)=>{
        if(err)
            throw err
        console.log("removido!")
        res.status(202).send()  
    })
})
  //endpoint p upload d img:
router.post('/campanhas/uploadImg',upload.single('upload'),(req,res)=> {
    console.log(req.file)//o path que irei retornar
    res.send({  path:req.file.path,
                nome: req.file.filename,//é o nome gerado e é o que será salvo
                originalName: req.file.originalname})//nome amigavel pra display pro usuário
})
router.get('/campanhas/produtos',async(req,res) => {
    //pega todos os produtos de uma campanha
   // console.log("req data ", req.query.campanha_id)//passo como params mas ele bota pra query..wtf, mas que seja xD
    const campanha_id = req.query.campanha_id
    
    console.log("entro com id ", campanha_id)
    try{
        console.log(" q passa")
        const campanha = await Campanha.findById(campanha_id)//acha a campanha q contem o array de interesse
        res.status(202).send({ produtos:campanha.produtos})
    }catch(e){
        console.log("zik")
        res.status(500).send(e)
    }    
})
router.post('/campanhas/createCampanha', async (req,res) => {//cria campanha
    const new_campanha = new Campanha(req.body)
    try{
        await new_campanha.save()
        //gambiarra pra salvar o id gerado numa propriedade a parte e manipular no codigo xD
        new_campanha.campanha_id = new_campanha._id
        await new_campanha.save()
        res.status(202).send({
           campanha_id: new_campanha._id,
           atributoid: new_campanha.campanha_id//retorna o _id pra eu poder ref/identificar uma campanha no codigo
        })
       
    }catch(e){
        res.status(500).send("n rolou de criar campanha" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
})
router.delete('/campanhas/removeCampanha',(req,res)=>{
    //deleta campanha por id
    const campanha_id =  req.body.campanha_id
    Campanha.findByIdAndDelete(campanha_id,(err,doc)=>{
        if(err)
            res.status(404).send(err)
        res.status(202).send(doc)    
    })
})
router.put('/campanhas/removeRow',async(req,res)=>{
    //rempve uma linha da tabela
    const campanha_id = req.body.campanha_id
    const row_id = req.body.row_id
    const imgPath = req.body.path//path da img q irei excluir
    if(imgPath !== undefined){//será undefined caso o item n tenha foto associada
        axios.post('/campanhas/removeImg',{
            path: imgPath
        }).then(r => console.log("deleteeei"))
        .catch(e => console.log("erro xd ", e))
    }    
    //excluo o path da img, dps excluo a linha em si, tanto faz a ordem ja q sao operacoes independentes
    Campanha.findOneAndUpdate({_id: campanha_id}, { $pull: {produtos:{_id:row_id}}},(err,doc)=>{
        if(err){
            res.status(500).send(err)
        }
        res.status(202).send(doc)
    })
})

router.patch('/campanhas/updateRow',filterInput,async(req,res) => {
    const campanha_id = req.body.campanha_id//id da CAMPANHA
    const row_id = req.body.row_id //id da linha que tou atualizando
    const produtos = req.body.produtos//linha a ser atualizada ao array de produtos
    console.log("entrei campanha_id ", campanha_id, " row id ", row_id, " prod ", produtos)
    try{
        const campanha = await Campanha.findById(campanha_id)//acha a campanha q contem o array de interesse
        //me dá o index da linha que estou tentando atualizar:
        var targetIndex =  campanha.produtos.findIndex( it =>{
            return it._id.equals(row_id)
        }) 
        //atualiza os produtos
        const keys = Object.keys(produtos)
        keys.forEach(key => {
            //[key] é analogo a .proriedade no contexto que to usando:
            campanha.produtos[targetIndex][key] = produtos[key]
        })
        try{
            //salva alterações
            await campanha.save()
            res.status(202).send("0k")
        }catch(e){
            res.status(500).send(e)
        }
    }catch(e){
        console.log("errorrr no be ", e)
        res.status(404).send(e)
    } 
})
router.post('/campanhas/addRow',filterInput,(req,res) => {//adiciona linha de produtos a campanha
   // console.log("entrou")
    const campanha_id = req.body.campanha_id//id da CAMPANHA
    const produtos = req.body.produtos//linha a ser adicionada ao array de produtos ja filtrada pelo middleware
    console.log("entro com: ", produtos, " id: ", campanha_id)
    Campanha.findOneAndUpdate({_id: campanha_id}, {$push: {produtos}},{new: true},(err,doc)=>{
        if(err){
            console.log("deu ruim")
            res.status(500).send(err)
        }    
        const addedItensIndex = doc.produtos.length - 1//indice da linha adicionada, usarei no codigo pra ref    
        res.status(202).send(doc.produtos[addedItensIndex]._id)//pra eu ter a ref dessa linha em particular   
    });   
})   

module.exports = router