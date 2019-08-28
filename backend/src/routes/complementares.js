const axios = require('axios')
const express = require('express')
const Complementar = require('../models/complementar')
const router = new express.Router()

router.get('/complementares/getComplementar',async(req,res) => {
    //pega todos os produtos do sistema
    try{
        const complementares = await Complementar.find({})
        console.log("ACHEI COMPLE :",complementares)
        res.status(202).send({complementares: complementares})
    }catch(e){
        console.log("nao consegui achar comple <routes/comple.js>")
        res.status(500).send(e)
    }    
}),
router.post('/complementares/addComplementar',async (req,res) => {//adiciona linha de produtos a campanha
    //const campanha_id = req.body.campanha_id//id da CAMPANHA
    let new_complementar = new Complementar(req.body.complementar)//linha a ser adicionada ao array de produtos ja filtrada pelo middleware

    try{
        await new_complementar.save()
        res.status(202).send({
            complementar_id: new_complementar._id,
        })
    }catch(e){
        console.log("nao consegui adicionar novo produto a colection produtos", e)
        res.status(500).send("nao consegui adicionar novo produto a colection produtos" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
}),

router.put('/complementares/removeComplementar',async(req,res)=>{
    const complementar_id = req.body.complementar_id
    const imgPath = req.body.path//path da img q irei excluir
   
    if(imgPath !== undefined ){ 
        axios.post('/campanhas/removeImg',{
            path: imgPath
        }).then(r => console.log("deleteeei"))
        .catch(e => console.log("erro xd ", e))
    }  
    else
        console.log("produtos.js removeProduto: n tem img associada pra remover ")  
    //excluo o path da img, dps excluo o produto em si
    Complementar.findByIdAndRemove( complementar_id,(err,doc)=>{
        
        if(err){
            console.log("nao consegui remover produto ", err)
            res.status(500).send(err)
        }
        console.log("removi produto com sucesso ")
        res.status(202).send(doc)
    })
})

module.exports = router //lembre de exportar, doidao xD