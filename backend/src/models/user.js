const mongoose = require('mongoose')
const validator = require('validator')

const User =  mongoose.model('User',{
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("email passado não é valido")         
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        validate(value){
            if(!validator.isLength(value,{min: 6}) || validator.matches(value,/password/i))
                throw new Error("senha precisa ter 6 digitos")
        }
    },
    userType: {
        type: String//admin(root/god),diretor,clientes
    }
})

module.exports = User