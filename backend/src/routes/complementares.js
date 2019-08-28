const axios = require('axios')
const express = require('express')
const Produto = require('../models/complementar')
const router = new express.Router()

router.get('/complementar/getComplementar',async(req,res) => {
    //pega todos os produtos do sistema
    try{
        const produtos = await Produto.find({})
        console.log("ACHEI :", produtos)
        res.status(202).send({ produtos: produtos})
    }catch(e){
        console.log("nao consegui achar produtos <routes/produtos.js>")
        res.status(500).send(e)
    }    
}),
router.post('/complementar/addComplementar',async (req,res) => {//adiciona linha de produtos a campanha
    //const campanha_id = req.body.campanha_id//id da CAMPANHA
    let new_produto = new Produto(req.body.produtos)//linha a ser adicionada ao array de produtos ja filtrada pelo middleware

    try{
        await new_produto.save()
        res.status(202).send({
            produto_id: new_produto._id,
        })
    }catch(e){
        console.log("nao consegui adicionar novo produto a colection produtos", e)
        res.status(500).send("nao consegui adicionar novo produto a colection produtos" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
}),
router.patch('/complementar/updateComplementar',async(req,res) => {
    const produto_id = req.body.produto_id
    const produtos = req.body.produtos//linha a ser atualizada ao array de produtos
    try{
        Produto.findOneAndUpdate(produto_id, produtos,{ new: true },(err,atualizado) => {
            if(err)
                return res.status(500).send(err)
        })
    }catch(e){
        console.log("errorrr no be ", e)
        res.status(404).send(e)
    } 
}),
router.put('/complementar/removeComplementar',async(req,res)=>{
    const produto_id = req.body.produto_id
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
    Produto.findByIdAndRemove( produto_id,(err,doc)=>{
        
        if(err){
            console.log("nao consegui remover produto ", err)
            res.status(500).send(err)
        }
        console.log("removi produto com sucesso ")
        res.status(202).send(doc)
    })
})

module.exports = router //lembre de exportar, doidao xD