const express = require('express')
require('./src/db/mongoose')//garante que vai conectar ao bd
const User = require('./src/models/user')
const app = express()

app.use(express.json())//parsea automaticamente os json pra objeto, dai posso acessar no body

app.post('/users', (req, res, next) => {
  console.log("opa ", req.body)
  const user = new User(req.body)
  user.save().then( () =>
    res.send(user)
  ).catch((e) =>  res.status(400).send(e))
   
})



// export the server middleware
module.exports = {
  path: '/backend',
  handler: app
}