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
    m_lucro: {//semanal/mensal
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
    produtos: [{//array d objetos, onde cada objeto é um token, que é uma string
        produto: {
            type: Object,
            required: true
        }
    }],
    status: {//aprovada/reprovada/pendente
        type: String,
        //required: true,
        //unique: true,
        //trim: true
    }
})

const Campanha =  mongoose.model('Campanha',campanhaSchema)

module.exports = Campanha