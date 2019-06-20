const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')

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
    email: {//como mudei o unique dps, preciso dropar o bd p faze funcionar
        type: String,
        required: true,
        unique: true,//email será unico, logo posso usa-lo como criterio p login
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
    tokens: [{//array d objetos, onde cada objeto é um token, que é uma string
        token: {
            type: String,
            required: true
        }
    }]
})
//metodos a lvl de instancia
userSchema.methods.generateAuthToken = async function(){
    const user = this//só por questao semantica
    const secret = 'lobodomar'  //tostring pq repare q no bd o _id é um objectId, mas quero le-la como string
    const token = jwt.sign({_id: user._id.toString()},secret)
    user.tokens = user.tokens.concat({token:token})//concatenar um novo item
  //  console.log("achou token e user associado")
    await user.save()//salvar as alteracoes no bd
    //console.log("salvo token: ", user._id)
    return token
}
//em vez de definir getPulicProfile, vou far um override no metodo toJSON, pois esse metodo semp é chamado e afetara td xD
userSchema.methods.toJSON = function(){ //..methods.getPublicProfile
    const user = this
    const userObject = user.toObject()//converte do formato doido do mongo pra um objeto
    delete  userObject.password
    delete userObject.tokens
    delete userObject.email

    return userObject
}
//metodos a lvl de model
userSchema.statics.findByCredentials = async function(name,password){//td q é . static sao f minhas q posso executar a nivel de model
    //console.log("procurando user pelo nome: ", name , " senha ", password)    

    const user = await User.findOne({name})

    if(!user){
       // console.log(" n acho user ")
        throw new Error('o login nao pode ser feito.')
    }    
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        //console.log("senha n bateu")
        throw new Error('o login nao pode ser feito. ')
    }    
    return user
}
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