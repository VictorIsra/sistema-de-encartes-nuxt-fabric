//modelo das imgs complementares que um usuario pode cadastrar ao sistema ( p usar no canvas)

const mongoose = require('mongoose')

const  complementarSchema = new mongoose.Schema({
    img:{
        type:Object
    }, 
})

const Complementar =  mongoose.model('Complementar',complementarSchema)
module.exports =  Complementar