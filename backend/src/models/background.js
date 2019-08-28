//modelo dos backgrounds que um usuario pode cadastrar ao sistema ( p usar no canvas)

const mongoose = require('mongoose')

const  backgroundSchema = new mongoose.Schema({
    img:{
        type:Object
    }, 
})

const Background =  mongoose.model('Background',backgroundSchema)
module.exports =  Background