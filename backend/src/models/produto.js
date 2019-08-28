//esse model diz respeito a base se dados do sistema, ou seja, os produtos cadastrados no sistema
//todo. Não é o produto relacionado a uma campanha, mas sim os produtos cadastrados no sistema ( é a base de dados basica, por asssim dizer)

const mongoose = require('mongoose')

const  produtoSchema = new mongoose.Schema({
    img:{
        type:Object
    },
    nome:{//produto ( nome do produto )
        type:String
    },
    //exclusiva a base de produtos v
    categoria:{
        type:String
    },
    empresa:{
        type:String
    },
    referencia:{
        type:String
    },
    preco_c:{
        type:String
    },
    preco_v:{
        type:String
    },
    qtdade:{//estoque
        type:String
    },
    unidade:{
        type:String
    } 
})

const Produto =  mongoose.model('Produto',produtoSchema)
module.exports = Produto