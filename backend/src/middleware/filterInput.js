const filterInput = function(req,res,next){
    //n esqueca do 'res' msm sem eu usar, pois 'next' n é uma palavra chave, é preciso q ele seja o terceiro arg p faze sentido
    //filtra a entrada pra remover o campo '_id', pois se n dá zica ja q esse campo é gerado sozinho
    console.log("entro middleware filterINput.js")
    const produtos = req.body.produtos
    const keys = Object.keys(produtos)//a entrada n pode conter o campo '_id', se n dá conflito. essa f tira esse campo
    const filtrado = {}
    keys.forEach(key => {
        if(key !== '_id')
            filtrado[key] = produtos[key]
    })
    console.log("middleware me deu: ",filtrado)
    req.body.produtos = filtrado
    next()
}
module.exports = filterInput