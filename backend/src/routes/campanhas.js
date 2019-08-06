const axios = require('axios')
const express = require('express')
const Campanha = require('../models/campanha')
const filterInput = require('../middleware/filterInput')//filtro body pra tirar o campo '_id'
//n preciso do router.use express json pq ja o fiz no index.js
//td necessario pro upload d imgs
const multer = require('multer')//p faze uploado da img pra um folder
const fs = require('fs')//p deletar a img de um folder ( path)
const crypto = require('crypto')
const path = require('path')

const router = new express.Router()

const storage = multer.diskStorage({
    destination: 'static/uploads/fotos',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)
        //p salvar o path com formato correto
        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
  })

const upload = multer({ storage: storage })

router.post('/campanhas/removeImg',(req,res)=>{
    //console.log("entrei deleta img, req.body: ",req.body)
    const path = req.body.path//path q usarei pra salvar pro bd, inclusive 
   
    fs.unlink(path,(err)=>{
        if(err)
            throw err 
        console.log("removido!")
        res.status(202).send()  
    })
})
  //endpoint p upload d img:
router.post('/campanhas/uploadImg',upload.single('upload'),(req,res)=> {
    console.log(req.file)//o path que irei retornar
    res.send({  path:req.file.path,
                nome: req.file.filename,//é o nome gerado e é o que será salvo
                originalName: req.file.originalname})//nome amigavel pra display pro usuário
})
router.get('/campanhas/produtos',async(req,res) => {
    //pega todos os produtos de uma campanha
   // console.log("req data ", req.query.campanha_id)//passo como params mas ele bota pra query..wtf, mas que seja xD
    const campanha_id = req.query.campanha_id
    
    try{
        const campanha = await Campanha.findById(campanha_id)//acha a campanha q contem o array de interesse
        res.status(202).send({ produtos:campanha.produtos})
    }catch(e){
        console.log("zik")
        res.status(500).send(e)
    }    
})
router.get('/campanhas/generalInfo',async(req,res) => {
    //pega info gerais de uma campanha: nome,tipo,status,qtdade de produtos etc...
    //se req.query.campanha_id n existir, é pq n passei arg algum e por isso irei fetchar tds as campanhas, caso exista, fetcharei apenas a campanha de interesse ( cujo id eu passei)
    const campanha_id = req.query.campanha_id
    try{
        let campanha = ''
        if(campanha_id === undefined)//se undined pege as infos de tds as campanhas
            campanha = await Campanha.find({})  
        else//se nao, pegue as info de uma campanha particular
            campanha = await Campanha.findById(campanha_id)
            
        let campanhas = []
        //checa se é um objecto ou um array de objeto, lembre q no js, se eu usar o typeof em um arry de objeto, ele dirá q é objeto, por isso essa linha estranah xD
        let isArr = Object.prototype.toString.call(campanha) == '[object Array]';
        if(isArr){//caso seja um arry of object
            campanha.forEach(campanha => 
                campanhas.unshift({//assim retorno só as info de interesse de cada campanha. Produtos, nesse caso, n é importartante
                    nome_empresa: campanha.empresa,
                    nome_campanha: campanha.campanha,
                    tipo_campanha: campanha.tipos_campanhas,
                    marluc: campanha.marluc,
                    data_i: campanha.data_inicio,
                    data_t: campanha.data_termino,
                    qtdade: campanha.produtos.length + "/" + campanha.qtdade,
                    campanha_id: campanha.campanha_id,
                    status: campanha.status,
                    produtos: campanha.produtos,
                    demanda: campanha.demanda,
                    demanda_criada: campanha.demanda_criada
            }))
        }
        else//se tiver um id, retornará um objeto, nao um array, aí n teria sentido usar foreach
            campanhas = campanha//caso seja um unico objeto.    
        res.status(202).send({
            campanhas
        })
    }catch(e){
        console.log("algo deu errado: ",e)
        res.status(500).send(e)
    }    
})
router.post('/campanhas/createCampanha', async (req,res) => {//cria campanha
    const new_campanha = new Campanha(req.body)
    //cria uma campanha + preenche as info gerais ( qqr info q n seja relacionada com o produtos, q é feita numa etapa posterior xD)
    try{

        await new_campanha.save()
        //gambiarra pra salvar o id gerado numa propriedade a parte e manipular no codigo xD
        new_campanha.campanha_id = new_campanha._id
        await new_campanha.save()

        res.status(202).send({
           campanha_id: new_campanha._id,
           atributoid: new_campanha.campanha_id//retorna o _id pra eu poder ref/identificar uma campanha no codigo
        })
       
    }catch(e){
        console.log(" zik foi ", e)
        res.status(500).send("n rolou de criar campanha" + e )//n sei pq, se passo só send(e), ele n printa nada
    }
})
router.put('/campanhas/removeCampanha',(req,res)=>{
    //deleta campanha por id
    const campanha_id = req.body.campanha_id
    Campanha.findByIdAndDelete(campanha_id,(err,doc)=>{
        if(err)
            res.status(404).send(err)
        res.status(202).send(doc)    
    })
})
router.put('/campanhas/removeRow',async(req,res)=>{
    //rempve uma linha da tabela
    const campanha_id = req.body.campanha_id
    const row_id = req.body.row_id
    //n exclui mais pois agora s imgs vem de uma base comum!
    const imgPath = req.body.path//path da img q irei excluir
    console.log("IDD ", campanha_id, " img path ", imgPath)
    //só pode excluir img da base de dados, que é essa(s) campanha(s) é(sao) hardcoded
    //ou seja, só essas duas ids tem permissao de defato deeltar uma fot,bg, oq seja do sistema
    if(imgPath !== undefined && (campanha_id === '5d2f6b45384572128c682715' || campanha_id === '5d4223b924a1f1483c193259'|| campanha_id === '5d478c3082c8e55273f6bad1')){//será undefined caso o item n tenha foto associada
        console.log("VAIII DELETA")
        axios.post('/campanhas/removeImg',{
            path: imgPath
        }).then(r => console.log("deleteeei"))
        .catch(e => console.log("erro xd ", e))
    }  
    else
        console.log("wtf como assim xddd ")  
    //excluo o path da img, dps excluo a linha em si, tanto faz a ordem ja q sao operacoes independentes
    Campanha.findOneAndUpdate({_id: campanha_id}, { $pull: {produtos:{_id:row_id}}},(err,doc)=>{
        console.log("AGORA ATUA id ", row_id)
        if(err){
            console.log("errrouuuuu oq ", err)
            res.status(500).send(err)
        }
        console.log("atualizouuu")
        res.status(202).send(doc)
    })
})
router.get('/campanhas/loadTabloide',async(req,res)=>{
    const campanha_id = req.query.campanha_id
    try{
        const campanha = await Campanha.findById(campanha_id)
        res.send({
            tabloide: campanha.tabloide,
            tabloide_bg: campanha.tabloide_bg,
            tabloide_folha: campanha.tabloide_folha
        })
    }catch(e){
        console.log("n consegui carregar ",e)
        res.status(500).send(e) 
    }
})
router.post('/campanhas/saveTabloide',async(req,res)=> {
    const tabloide = req.body.tabloide
    const folha = req.body.folha //defult é 'a4'
    const campanha_id = req.body.id
    const tabloide_bg = req.body.bg
    try{
        const campanha = await Campanha.findById(campanha_id)
        campanha.tabloide = tabloide
        if(tabloide_bg)
            campanha.tabloide_bg = tabloide_bg
        campanha.tabloide_folha = folha//salva tipo de folha: a3, a4 etc
        try{
            await campanha.save()
            console.log("canvastab salvo com sucesso!")
        }catch(e){
            console.log("n consegui tabloiderr",e)
            res.status(500).send(e)
        }
    }catch(e){
        console.log("n consegui salva update de status da campanha ",e)
        res.status(500).send(e) 
    }
})  
router.patch('/campanhas/changeStatus', async (req,res)=>{
    const campanha_id = req.body.id
    let demanda_criada = req.body.demanda_criada//serve só pra uma campanha cujo diretor criou demandas associada a ela
    const campanha_status = req.body.status//status da campanha: pendente, enviado para tabloide, em avaliacao, ap, reprovado
   
    console.log("entrou: ",req.body)
    try{
       const campanha = await Campanha.findById(campanha_id)
       campanha.status = campanha_status
       if(campanha.demanda_criada !== true)//pois só quero alterar isso uma unica vez. dado q é true, será semp true e a vida segue
        campanha.demanda_criada = demanda_criada

       try{
        await campanha.save()
        console.log("status modificad com sucesso ")
        res.status(202).send(campanha)//envia a campanha atualizada
       }catch(e){
           console.log("n consegui salva update de status da campanha ",e)
           res.status(500).send(e)
       }
    }
    catch(e){
        console.log("n pude mudar o status da campanah de id " + campanha_id + " erro: ",e)
        res.status(500).send(e)
    }
})
router.patch('/campanhas/updateRow',filterInput,async(req,res) => {
    const campanha_id = req.body.campanha_id//id da CAMPANHA
    const row_id = req.body.row_id //id da linha que tou atualizando
    const produtos = req.body.produtos//linha a ser atualizada ao array de produtos
    try{
        const campanha = await Campanha.findById(campanha_id)//acha a campanha q contem o array de interesse
        //me dá o index da linha que estou tentando atualizar:
        var targetIndex =  campanha.produtos.findIndex( it =>{
            return it._id.equals(row_id)
        }) 
        //atualiza os produtos
        console.log("achou linha")
        const keys = Object.keys(produtos)
        keys.forEach(key => {
            //[key] é analogo a .proriedade no contexto que to usando:
            campanha.produtos[targetIndex][key] = produtos[key]
        })
        console.log("atualizo")

        try{
            //salva alterações
            await campanha.save()
            res.status(202).send("0k")
        }catch(e){
            console.log("n consegui salva: ", e)
            res.status(500).send(e)
        }
    }catch(e){
        console.log("errorrr no be ", e)
        res.status(404).send(e)
    } 
})
router.post('/campanhas/addRow',filterInput,(req,res) => {//adiciona linha de produtos a campanha
    const campanha_id = req.body.campanha_id//id da CAMPANHA
    let produtos = req.body.produtos//linha a ser adicionada ao array de produtos ja filtrada pelo middleware
    // console.log("porra ", req.body, " id ", campanha_id)
    // console.log("OLHE NO ADD ROW")
    //como o addrow é sempre feito em produtos, n em concorrencia, posso com seguranca setar o proce de concorrencia pra r$ 0,00 aqui. faco a lvl de bd em vez de app para garantir a existencia dos getters e setters ;)
    produtos.preco_v_c1 = "R$ 0,00"
    produtos.preco_v_c2 = "R$ 0,00"
    produtos.preco_v_c3 = "R$ 0,00"
    if(produtos.tabloide !== true)//parece estranho, mas preciso explicitar o tick na criacao, se n n vai aparecer na criacao de demandas. mas n posos setar pra falso se já existir como true, por isso seto pra falso q é o valor default, caso n tenha sido tickado. isso garante q vai aparecer o tick
        produtos.tabloide = false
    if(produtos.facebook !== true)
        produtos.facebook = false
    if(produtos.cartaz !== true)
        produtos.cartaz = false
    if(produtos.tvindoor !== true)
        produtos.tvindoor = false
    if(produtos.radio_interna !== true)
        produtos.radio_interna = false
    if(produtos.radio_externa !== true)
        produtos.radio_externa = false
    if(produtos.jornais !== true)
        produtos.jornais = false
    if(produtos.pov !== true)
        produtos.pov= false
    Campanha.findOneAndUpdate({_id: campanha_id}, {$push: {produtos}},{new: true},(err,doc)=>{
        if(err){
            console.log("deu ruim")
            res.status(500).send(err)
        }    
        const addedItensIndex = doc.produtos.length - 1//indice da linha adicionada, usarei no codigo pra ref    
        res.status(202).send({row_id:doc.produtos[addedItensIndex]._id})//pra eu ter a ref dessa linha em particular   
    });   
})   

module.exports = router