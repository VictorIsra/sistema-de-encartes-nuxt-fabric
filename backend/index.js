const express = require('express')
require('./src/db/mongoose')//garante que vai conectar ao bd
const userRoute = require('./src/routes/user')

const app = express()

app.use(express.json())//parsea automaticamente os json pra objeto, dai posso acessar no body
app.use(userRoute)


// export the server middleware
module.exports = {//em vez de escutar uma porta, exporto isso pro nuxt.config que ele irá 'escutar'
  path: '/backend',
  handler: app
}