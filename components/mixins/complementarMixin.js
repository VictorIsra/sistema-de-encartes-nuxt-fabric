import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada

export default {
    methods: {
        async getComplementar(){//bae de dado do sistema
            try{
                const out = await api.complementar.getComplementar({
                    // params: {
                    //     campanha_id
                    // }
                })
                console.log("TUDO AZUULLL ", out.data.produtos)
                return out.data.produtos
            }catch(e){
                console.log("Erro: ",e)
            }    
        },
        async addComplementar(editedItem){//vai virar um mixin
            try{ 
                const saida = await api.complementar.addComplementar(
                    { 
                        produtos:editedItem
                    }
                   // campanha_id}
                )
                //console.log("retornarei ", saida)
                return saida.data.produto_id
            }
            catch(e){
                console.log('erro ao tenta add linha ',e)
            }    
        },
        removeComplementar(path,produto_id){
            console.log("vejaa ",path)
             api.complementar.removeComplementar({
                produto_id,
                path: path //path da img que vou excluir ( lembre q excluir a linha é dif de excluir o path da img, sao operacoes dif)
             }).then(
               r => console.log("removido com sucesso: ")
             )
             .catch(e => console.log(e))
        },
        async imgUpload(file,item){//faz o upload da img a lvl de bd
            //file é o this.editeItem.img.imgfile, o item é a ref real: this.editeItem
            console.log("entro file e imtem ", file, " item: ", item)
            const formData = new FormData()
            formData.append('upload',file)
            //se oldpath n for undefined, é pq tem uma img antiga que quero remover em paralelo de atuakizar nova xD
            if(item.img.src !== undefined)//se o item anteriormente n tinha foto, isso sera undefined e n tera setnido deletar, mas caso tenha uma img anterior, essa f removera o path antigo e no api.imgUpload ira salvar uma nova. isso evita que a pasta de fotos fique flodada com fotos desnecessarias/antigas xD
                api.campanha.removeImg({path: item.img.src})

            try{
              const data = await api.campanha.uploadImg(formData)//.then(
              console.log("sucesso: ")
              item.img = {
                src: data.data.path,//path pro bd
                name: data.data.nome,//name pro bd, tá contido no path, mas quero salvar separado tb, por precaucao
                originalName: data.data.originalName
              }
            }catch(e){
              console.log("erro ", e)
            } 
        }
    }
}    