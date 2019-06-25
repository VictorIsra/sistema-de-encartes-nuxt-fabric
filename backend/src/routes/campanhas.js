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
// router.patch('/campanhas/update', async (req,res) => {
    
//    // const allowedUpdates = [ "name","password","userType"]
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
router.post('/campanhas/create', async (req,res) => {//cria campanha
    //achar user pelas credenciais
    //retornará um token de autenticacao
    console.log("vai dar um new no body")
    const new_campanha = new Campanha(req.body)
    try{
        console.log("tentooou")
        await new_campanha.save()
        res.status(202).send({
           campanhaID: new_campanha._id//retorna o _id pra eu poder ref/identificar uma campanha no codigo
        })
       
    }catch(e){
        console.log("se fudeu")
        res.status(500).send("n rolou de criar campanha" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
})
router.patch('/campanhas/updateRow',async(req,res) => {
    const campanha_id = req.body.campanha_id//id da CAMPANHA
    const produtos = req.body.produtos//linha a ser adicionada ao array de produtos
        //adiciona uma linha ao array de produtos de uma campanha ja existente
    try{
        const campanha = await Campanha.findById(campanha_id)
        console.log("ueeee")
      
      //  const tid = mongoose.Types.ObjectId('5d118cdaedeca362ba32a474')
        
     //  const index = campanha.produtos.find((it,i)=>{
          var ind =  campanha.produtos.findIndex( (it,i) =>{
               //const id = mongoose.Types.ObjectId(it._id)
               return it._id.equals('5d117a92a42ad9547a12b74f')
                //    return i
                //else return false
            })
            //aeeeeeee
           console.log("Indice q quero: ", typeof(ind))
           //console.log("veja ", campanha.produtos[ind])
            campanha.produtos[ind] = {
                _id:campanha.produtos[ind]._id,
                marluc:'10,00%',
                data_i:'1//2/201'
            }
            try{
                await campanha.save()

            }catch(e){
                console.log(e)
            }
           res.status(202).send("0k")
    }catch(e){
        res.status(404).send(e)
    } 
})
router.post('/campanhas/addRow',(req,res) => {//adiciona linha de produtos a campanha
    console.log("entrou")
    const campanha_id = req.body.campanha_id//id da CAMPANHA
    const produtos = req.body.produtos//linha a ser adicionada ao array de produtos
        //adiciona uma linha ao array de produtos de uma campanha ja existente
    Campanha.findOneAndUpdate({_id: campanha_id}, {$push: {produtos}},{new: true},(err,doc)=>{
        if(err){
            console.log("deu ruim")
            res.status(500).send(err)
        }    
        const addedItensIndex = doc.produtos.length - 1//indice da linha adicionada, usarei no codigo pra ref    
        res.status(202).send(doc.produtos[addedItensIndex]._id)//pra eu ter a ref dessa linha em particular   
    });   
})   
   // console.log("req.body ", req.body, " req.body.produtos ", req.body.produtos)
   // const new_campanha = new Campanha(req.body)
//    Campanha.findByIdAndUpdate(
       
//    )
//     try{
//         console.log("tentooou")
//         await new_campanha.save()
//      //   if(new_user){//n precisa pois a operacao assima retorna uma promise
//             //const user = await User.findByCredentials(req.body.email, req.body.password)//f q eu irei defini
//         new_campanha.produtos.forEach(p => console.log(" id do prod ", ))
//         const x = new_campanha.produtos.length -1
//         console.log("leng dos prod ",new_campanha.produtos.length,
//         " posicao do mais novo",new_campanha.produtos[x]._id )
//         res.status(202).send({
//             // id_campanha:new_campanha._id,
//             // produtos:new_campanha.produtos
//             teste:new_campanha._id,
//             ida:new_campanha.produtos[new_campanha.produtos.length]
//         })
       
//     }catch(e){
//         console.log("se fudeu")
//         res.status(500).send("n rolou de criar campanha" + e )//n sei pq, se passo só send(e), ele n printa nada
//     }


module.exports = router