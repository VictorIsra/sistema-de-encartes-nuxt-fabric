const express = require('express')
require('./src/db/mongoose')//garante que vai conectar ao bd
const userRoute = require('./src/routes/user')
const campanhaRoute = require('./src/routes/campanhas')
const produtoRoute = require ('./src/routes/produtos')
const backgroundRoute = require ('./src/routes/backgrounds')
const complementarRoute = require ('./src/routes/complementares')
// const multer = require('multer')//p faze uploado da img pra um folder
// const fs = require('fs')//p deletar a img de um folder ( path)
// const crypto = require('crypto')
// const path = require('path')
const app = express()

const bodyParser = require('body-parser');


// Express 4.0
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
// app.post('/teste',(req,res)=>{
//     const path = req.body.path   
//     fs.unlink(path,(err)=>{
//         if(err)
//             throw err
//         console.log("removido!")
//         res.status(202).send()  
//     })
// })
//   //endpoint p upload d img:
// app.post('/upload',upload.single('upload'),(req,res)=> {
//     console.log(res)//o path que irei retornar

//     res.send(req.file)
// })
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
app.use(userRoute)
app.use(campanhaRoute)
app.use(produtoRoute)
app.use(backgroundRoute)
app.use(complementarRoute)
// export the server middleware
module.exports = {//em vez de escutar uma porta, exporto isso pro nuxt.config que ele irá 'escutar'
  path: '/backend',
  handler: app
}