const axios = require('axios')
const express = require('express')
const Background = require('../models/background')
const router = new express.Router()

router.get('/backgrounds/getBackgrounds',async(req,res) => {
    //pega todos os produtos do sistema
    try{
        const bgs = await Background.find({})
       // console.log("BGS do sistema:", bgs)
        res.status(202).send({ bgs: bgs})
    }catch(e){
        console.log("nao consegui achar bgs <routes/bgs.js>")
        res.status(500).send(e)
    }    
}),
router.post('/backgrounds/addBackground',async (req,res) => {//adiciona linha de produtos a campanha
    //const campanha_id = req.body.campanha_id//id da CAMPANHA
    let new_bg = new Background(req.body.bgs)//linha a ser adicionada ao array de produtos ja filtrada pelo middleware

    try{
        await new_bg.save()
        res.status(202).send({
            bg_id: new_bg._id,
        })
    }catch(e){
        console.log("nao consegui adicionar novo produto a colection produtos", e)
        res.status(500).send("nao consegui adicionar novo produto a colection produtos" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
}),
router.put('/backgrounds/removeBackground',async(req,res)=>{
    const bg_id = req.body.bg_id
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
    Background.findByIdAndRemove(bg_id,(err,doc)=>{
        
        if(err){
            console.log("nao consegui remover produto ", err)
            res.status(500).send(err)
        }
        console.log("removi produto com sucesso ")
        res.status(202).send(doc)
    })
})

module.exports = router //lembre de exportar, doidao xD