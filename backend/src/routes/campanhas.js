const express = require('express')
const Campanha = require('../models/campanha')
const filterInput = require('../middleware/filterInput')//filtro body pra tirar o campo '_id'
//n preciso do router.use express json pq ja o fiz no index.js
const router = new express.Router()


router.get('/campanhas/me',async(req,res) => {
    // const user = { 
    //     name:req.user.name,
    //     _id: req.user._id,
    //     userType: req.user.userType
    // }
    res.send("mandei")//req.user foi passado pela funcao auth qd o user foi autenticado xD
})
// router.delete('/campanhas/me', auth, async (req,res)=>{
        
//     try{
//         await req.user.remove()//remove o usuario autenticado, msm efeito das linhas acima
//         res.send(req.user)//retorna o profile deletado
//     }catch(e){
//         res.status(500).send(e)
//     }
// })
// router.patch('/campanhas/update', async (req,res) => {
    
//    // const allowedUpdates = [ "name","password","userType"]
//     const updates = Object.keys(req.body)
//     const filtro = updates.every(field => allowedUpdates.includes(field))
     
//     if(!filtro)
//         res.status(404).send("invalid updates...")
    
//     try{ 
//        // const user = await User.findById(_id)//findByIdAndUpdate(_id,req.body,{new: true})//retorna o user atualizado, em vez do antigo
//         updates.forEach(update => req.user[update] = req.body[update])
//         await req.user.save()//hook pro midware será executado imediatamente antes de chamar .save()                    
//         const msg = "usuário atualizado: " + req.user
//         res.status(202).send(msg)//como ja salvou. mostra o usuario atual(modificado/atualizado)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })
router.post('/campanhas/create', async (req,res) => {//cria campanha
    //achar user pelas credenciais
    //retornará um token de autenticacao
    console.log("vai dar um new no body")
    const new_campanha = new Campanha(req.body)
    try{
        console.log("tentooou")
        await new_campanha.save()
        res.status(202).send({
           campanhaID: new_campanha._id//retorna o _id pra eu poder ref/identificar uma campanha no codigo
        })
       
    }catch(e){
        console.log("se fudeu")
        res.status(500).send("n rolou de criar campanha" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
})
router.delete('/campanhas/removeRow',async(req,res)=>{
    //rempve uma linha da tabela
    const campanha_id = req.body.campanha_id
    const row_id = req.body.row_id
    Campanha.findOneAndUpdate({_id: campanha_id}, { $pull: {produtos:{_id:row_id}}},(err,doc)=>{
        if(err){
            console.log("deu merda")
            res.status(500).send(err)
        }
        res.status(202).send("removido! xD")
    })
})
router.patch('/campanhas/updateRow',filterInput,async(req,res) => {
    const campanha_id = req.body.campanha_id//id da CAMPANHA
    const row_id = req.body.row_id //id da linha que tou atualizando
    const produtos = req.body.produtos//linha a ser atualizada ao array de produtos
    
    try{
        const campanha = await Campanha.findById(campanha_id)//acha a campanha q contem o array de interesse
        //me dá o index da linha que estou tentando atualizar:
        //console.log("acho campanha")
        var targetIndex =  campanha.produtos.findIndex( it =>{
            return it._id.equals(row_id)
        }) 
        //console.log("achou tg index")
        //atualiza os produtos
        const keys = Object.keys(produtos)
        keys.forEach(key => {
            //[key] é analogo a .proriedade no contexto que to usando:
            campanha.produtos[targetIndex][key] = produtos[key]
        })
        //console.log("fez update")
        try{
            //salva alterações
            await campanha.save()
            res.status(202).send("0k")
        }catch(e){
            res.status(500).send(e)
        }
    }catch(e){
        res.status(404).send(e)
    } 
})
router.post('/campanhas/addRow',filterInput,(req,res) => {//adiciona linha de produtos a campanha
   // console.log("entrou")
    const campanha_id = req.body.campanha_id//id da CAMPANHA
    const produtos = req.body.produtos//linha a ser adicionada ao array de produtos ja filtrada pelo middleware
    
    console.log("req.body.produtos apos o middleware: ", produtos)
    
    Campanha.findOneAndUpdate({_id: campanha_id}, {$push: {produtos}},{new: true},(err,doc)=>{
        if(err){
            //console.log("deu ruim")
            res.status(500).send(err)
        }    
        const addedItensIndex = doc.produtos.length - 1//indice da linha adicionada, usarei no codigo pra ref    
        res.status(202).send(doc.produtos[addedItensIndex]._id)//pra eu ter a ref dessa linha em particular   
    });   
})   

module.exports = router