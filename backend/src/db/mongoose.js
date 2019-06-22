const mongoose = require('mongoose')
//se conecta com o bd
mongoose.connect('mongodb://127.0.0.1:27017/encarte-api',{
    useNewUrlParser: true,
    useCreateIndex: true ,//cria o index automaticamente, bem nice
    useFindAndModify: false
    
})
  