const mongoose = require('mongoose')
//validator é um mod que faz validacoes mais robustas...n é obrigatorio, mas é legal

mongoose.connect('mongodb://127.0.0.1:27017/encarte-api',{
    useNewUrlParser: true,
    useCreateIndex: true //cria o index automaticamente, bem nice
})
  