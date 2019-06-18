const express = require('express')
const User = require('../models/user')
//n preciso do router.use express json pq ja o fiz no index.js
const router = new express.Router()

router.get('/users',async(req,res) => {
    
    try{
        const users = await User.find({}, '_id name')
        res.status(202).send(users)
    }catch(e){
        res.status(404).send(e)
    }
})
router.get('/users/:id', async (req,res) => {
    
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user)
            res.status(404).send()
        else
            res.status(202).send(user)
    }catch(e){
        res.status(500).send(e)
    } 
})
router.delete('/users/:id',async (req,res)=>{
    
    const _id = req.params.id
    
    try{
        const deletedUser = await User.findByIdAndDelete(_id)
        if(!deletedUser)
            res.status(404).send()
        else
            res.status(202).send(deletedUser)
    }catch(e){
        res.status(500).send(e)
    }
})
router.patch('/users/:id', async (req,res) => {
    
    const allowedUpdates = [ "name","password","userType"]
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const filtro = updates.every(field => allowedUpdates.includes(field))
     
    if(!filtro)
        res.status(404).send("invalid updates...")
    
    try{ 
        const user = await User.findById(_id)//findByIdAndUpdate(_id,req.body,{new: true})//retorna o user atualizado, em vez do antigo
        updates.forEach(update => user[update] = req.body[update])
        await user.save()//hook pro midware será executado imediatamente antes de chamar .save()
   
        if(!user) 
            res.status(404).send() 
        else                              
            res.status(202).send(user)   
    }catch(e){
        res.status(500).send(e)
    }
})
router.post('/users', async (req, res, next) => {
    
    const user = new User(req.body)
    
    try{
        await user.save()
        res.send(user)
     }
    catch(e){
        res.status(404).send(e)
    }      
})

router.post('/users/login', async (req,res) => {
    //achar user pelas credenciais
    //retornará um token de autenticacao
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)//f q eu irei definir
        const token = await user.generateAuthToken()//criarei esse metodo a lvl de instancia
        res.status(202).send(token)
    }catch(e){
        res.status(404).send("" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
})
module.exports = router