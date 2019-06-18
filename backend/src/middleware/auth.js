const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,'lobodomar')  //decodifica o payload do token (valida-o)
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})//procurará no array de tokens ( tokens.token ) se há um match com o token passado pelo user no req.header
        if(!user){
            throw new Error()
        }//n precisa de else, poiss o throw retorna um error
       // else{
        req.user = user //pro next poder passar pra prox rota o user logado
        next()
        //}    
    }catch(e){
        res.status(401).send({ error: "Você não tem permissão para acessar esta area. "})
    }
}

module.exports = auth