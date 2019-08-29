const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {
    try{
        const token = req.header('x-access-token').replace('Bearer ','')
       // console.log("tento req.header: ", req.header('x-access-token'))
        //console.log("TOKENzin: ", token)
        const decoded = jwt.verify(token,'lobodomar')  //decodifica o payload do token (valida-o)
       // console.log("decoded: ", decoded)
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})//procurará no array de tokens ( tokens.token ) se há um match com o token passado pelo user no req.header
        if(!user){
            console.log("user nao encontrado: auth.js backend")
            //console.log("ths ", this.$router)
            throw new Error()
        }//n precisa de else, poiss o throw retorna um error
       // else
        req.token = token
        req.user = user //pro next poder passar pra prox rota o user logado
        //console.log("achooou")
        next()
        //}    
    }catch(e){
        
        res.status(401).send({ error: "Você não tem permissão para acessar esta area. "})
    }
}

module.exports = auth