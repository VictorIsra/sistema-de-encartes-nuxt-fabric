const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    userType: {
        type: String,//admin(root/god),diretor,clientes,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
      //  required: true,
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
    }
})
//executar midwarees antes de salvar, por ex
//ha varios metodos/queries q eu podia executar o midware antes, no caso, farei com o 'save'
userSchema.pre('save', async function(next){//uso f normal pq arrow f nao faz bind do this
    //this se refere ao documento(instancia) q será salva
    const user = this //dá no msm, só mais facil de entender semanticamente
    
    if(user.isModified('password')){//ismodief é true na criacao de um user e no update de um user
        user.password = await bcrypt.hash(user.password, 8)//8 rounds é um bom balanco de seg/veloci
    }
    next()//n esqueça, se n ele n sabera que acabri e que deve continuar (pois ele executad
    //td q vem antes do 'next' antes de, de fato chamar o metodo save ;D )
})
const User =  mongoose.model('User',userSchema)

module.exports = User