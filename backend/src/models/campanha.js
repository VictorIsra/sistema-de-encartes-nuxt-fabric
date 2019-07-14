const mongoose = require('mongoose')


const campanhaSchema = new mongoose.Schema({
    empresa: {
        type: String,//admin(root/god),diretor,clientes,
        required: true
    },
    campanha: {//nome da campanha
        type: String,
        required: true,
        //unique: true,
        trim: true
    },
    tipos_campanhas: {//semanal/mensal
        type: String,
        required: true,
        //unique: true,
        trim: true
    },
    marluc: {//semanal/mensal
        type: String,
        required: true,
        //unique: true,
        trim: true
    },
    data_inicio: {//semanal/mensal
        type: String,
        required: true,
        //unique: true,
        trim: true
    },
    data_termino: {//semanal/mensal
        type: String,
        required: true,
        //unique: true,
        trim: true
    },
    qtdade: {//qtdade de produtos minimo pra cafastra campanha
        type: String,
        required: true,
        //unique: true,
        trim: true
    },
    demanda: {//diferenciar demanda de campanhas
        type: Boolean
    },
    demanda_criada:{//serve pra parte das demandas referentes a uma campanha, apenas. qd o diretor salvar a demanda ref a campanha, isso será true e aparecerá essa campanha no painel de demandas
        type: Boolean
    },
    campanha_id: {
        //vai receber o valor de _id gerado automaticamente p eu poder ref no codigo
        type: String
    },
    // produtos: {    //ai posso passar um array de objetos [ {obj1},{obj2}] etc
    //     type: Array,
    //     "default":[]
    // },
    produtos: [//a principio deixarei assim pois gera um ID pra cada elemento do array
        {
            img:{
                type:Object
            },
            nome:{
                type:String
            },
            qtdade:{
                type:String
            },
            unidade:{
                type:String
            },
            obs:{
                type:String
            },
            data_i:{
                type:String
            },
            data_f:{
                type:String
            },
            preco_c:{
                type:String
            },
            preco_v:{
                type:String
            },
            selout:{
                type:String
            },
            marluc:{
                type:String
            },
            preco_v_c1:{
                type:String
            },
            preco_v_c2:{
                type:String
            },
            preco_v_c3:{
                type:String
            },
            //info das demandas
            tabloide: {//pq tem o status ( boolean) e a msg associada
                type:Boolean
            },
            facebook: {
                type:Boolean
            },
            cartaz: {
                type:Boolean
            },
            tvindoor: {
                type:Boolean
            },
            radio_interna: {
                type:Boolean
            },
            radio_externa: {
                type:Boolean
            },
            jornais: {
                type:Boolean
            },
            pov: {
                type:Boolean
            },
            obs:{
                type:String
            }
        }
    ],
    status: {//aprovada/reprovada/pendente
        type: String,
        required: true,
        //unique: true,
        //trim: true
    }
})
const Campanha =  mongoose.model('Campanha',campanhaSchema)

module.exports = Campanha