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

        },
        removeUser(user_id){
            api.auth.remove({
                user_id
            })
            .then(r => console.log("user removido com sucesso! "))
            .catch(e => console.log("n pude remover user..."))
        },
        async checkRootUser(){
            try{
               const existe = await api.auth.checkRoot()
               //console.log("EXISTE? ",existe.data === '')
               if(existe.data === '')
                return false//n existe user root, entao mandarei a flag e irei cria-lo
               else
                return true 
            }catch(e){
                console.log("userCRUD.js: error em checkRootUser()")
            }
        }
    }
}