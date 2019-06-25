const express = require('express')
require('./src/db/mongoose')//garante que vai conectar ao bd
const userRoute = require('./src/routes/user')
const campanhaRoute = require('./src/routes/campanhas')
const bodyParser = require('body-parser')//ESSENCIAL, NÃO ESQUECER!
const app = express()

// app.use((req,res,next) => { //teste midware geral
//   if(req.method === 'GET'){
//     res.send("nao pode viado")
//   }
//   else{
//     next()//lembre disso, se n ficará no loop eterno xD
//   }
// })// segundo a doc do express, como  nao especifiquei o path
//eu irei criar um midware geral, que será executado para QQR REQ do app,
//se quisesse um midware mais restrito, especificava um path como primeiro argumento

app.use(express.json())//parsea automaticamente os json pra objeto, dai posso acessar no body
//achei q n precisava mas..precisa sim rs. estranho q os metodos q tem um midware q eu fiz, n precisaram..mas enfim
app.use(bodyParser.urlencoded({ extended: true }));//passagem principal, nao esquecer
//
app.use(userRoute)
app.use(campanhaRoute)

// export the server middleware
module.exports = {//em vez de escutar uma porta, exporto isso pro nuxt.config que ele irá 'escutar'
  path: '/backend',
  handler: app
}