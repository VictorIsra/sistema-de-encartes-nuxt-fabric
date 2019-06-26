const express = require('express')
require('./src/db/mongoose')//garante que vai conectar ao bd
const userRoute = require('./src/routes/user')
const campanhaRoute = require('./src/routes/campanhas')
const multer = require('multer')
const app = express()

 
const upload = multer({
  dest:'backend/uploads/fotos',//pasta q guardará imgs
  limits:{
    fileSize: 1000000//max 1mb o tamanho a img
  },
  fileFilter(req,file,cb){
    // cb(new Error('Arquivo precisa ser uma imagem'))//se der erro
    // cb(undefined,true)//td ok
  }
})
//endpoint p upload:
app.post('/upload',upload.single('upload'),(req,res)=> {
  console.log(res)
  res.send()
})
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

// export the server middleware
module.exports = {//em vez de escutar uma porta, exporto isso pro nuxt.config que ele irá 'escutar'
  path: '/backend',
  handler: app
}