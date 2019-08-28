//const axios = require('axios')
const express = require('express')
const Produto = require('../models/produto')
const router = new express.Router()

router.get('/produtos/getProdutos',async(req,res) => {
    //pega todos os produtos do sistema
    // console.log("req data ", req.query.campanha_id)//passo como params mas ele bota pra query..wtf, mas que seja xD
    //const campanha_id = req.query.campanha_id
    
    try{
        const produtos = await Produto.find({})
        console.log("ACHEI :", produtos)
        res.status(202).send({ produtos: produtos})
    }catch(e){
        console.log("nao consegui achar produtos <routes/produtos.js>")
        res.status(500).send(e)
    }    
})
module.exports = router //lembre de exportar, doidao xD