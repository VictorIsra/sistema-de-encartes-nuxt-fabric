const mongoose = require('mongoose')

if(process.env.NODE_ENV == 'production'){
    //se conecta com o bd
    mongoose.connect('mongodb://root:admin123@35.194.25.104:27017/encarte-api/?authSource=admin',{
        useNewUrlParser: true,
        useCreateIndex: true ,//cria o index automaticamente, bem nice
        useFindAndModify: false
        
    })
}else{
    //se conecta com o bd
    mongoose.connect('mongodb://127.0.0.1:27017/encarte-api',{
        useNewUrlParser: true,
        useCreateIndex: true ,//cria o index automaticamente, bem nice
        useFindAndModify: false
        
    })
}
  