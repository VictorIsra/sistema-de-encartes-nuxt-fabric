import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada
//fazer as req aqui, em vez de direto no componente. assim é mais organizado/modularizado
export default {
    methods: {
        registrar(userInfo){
            api.auth.signin(userInfo)
            .then(r => console.log("ok: ",r))
            .catch(e => console.log("bad ",e))
        }
    }
}