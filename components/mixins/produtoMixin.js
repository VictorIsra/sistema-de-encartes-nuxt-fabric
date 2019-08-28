import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada

export default {
    methods: {
        async getProdutos(){
            try{
                const out = await api.produto.getProdutos({
                    // params: {
                    //     campanha_id
                    // }
                })
                console.log("TUDO AZUULLL ", out)
                return out.data.produtos
            }catch(e){
                console.log("Erro: ",e)
            }    
        },
    }
}    