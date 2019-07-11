import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada
//fazer as req aqui, em vez de direto no componente. assim é mais organizado/modularizado
export default {
    methods: {
        async registrar(userInfo){
            try{
               const msg = await api.auth.signin(userInfo)
               return msg.data //só existirá se tiver dado um erro ( ex: user ja existir)
            }catch(e){
                console.log("erro ", e)
            }    
        },
        async fetchAll(){//pega tds os users cadastrados
            try{
                const users = await api.auth.fetch()
                return users.data
            }
            catch(e){
                console.log("erro ao tentar fetchar os users: ",e)
            }

        }
    }
}