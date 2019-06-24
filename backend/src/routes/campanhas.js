const express = require('express')
const Campanha = require('../models/campanha')
//n preciso do router.use express json pq ja o fiz no index.js
const router = new express.Router()


router.get('/campanhas/me',async(req,res) => {
    // const user = { 
    //     name:req.user.name,
    //     _id: req.user._id,
    //     userType: req.user.userType
    // }
    res.send("mandei")//req.user foi passado pela funcao auth qd o user foi autenticado xD
})
// router.delete('/campanhas/me', auth, async (req,res)=>{
        
//     try{
//         await req.user.remove()//remove o usuario autenticado, msm efeito das linhas acima
//         res.send(req.user)//retorna o profile deletado
//     }catch(e){
//         res.status(500).send(e)
//     }
// })
// router.patch('/campanhas/me', auth, async (req,res) => {
    
//     const allowedUpdates = [ "name","password","userType"]
//     const updates = Object.keys(req.body)
//     const filtro = updates.every(field => allowedUpdates.includes(field))
     
//     if(!filtro)
//         res.status(404).send("invalid updates...")
    
//     try{ 
//        // const user = await User.findById(_id)//findByIdAndUpdate(_id,req.body,{new: true})//retorna o user atualizado, em vez do antigo
//         updates.forEach(update => req.user[update] = req.body[update])
//         await req.user.save()//hook pro midware será executado imediatamente antes de chamar .save()                    
//         const msg = "usuário atualizado: " + req.user
//         res.status(202).send(msg)//como ja salvou. mostra o usuario atual(modificado/atualizado)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })



router.post('/campanhas/criar', async (req,res) => {
    //achar user pelas credenciais
    //retornará um token de autenticacao
    console.log("vai dar um new no body")
    const new_campanha = new Campanha(req.body)
    try{
        console.log("tentooou")
        await new_campanha.save()
     //   if(new_user){//n precisa pois a operacao assima retorna uma promise
            //const user = await User.findByCredentials(req.body.email, req.body.password)//f q eu irei defini
        res.status(202).send(new_campanha)
       
    }catch(e){
        console.log("se fudeu")
        res.status(500).send("n rolou de criar campanha" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
})

module.exports = router