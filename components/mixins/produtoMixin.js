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
                console.log("TUDO AZUULLL ", out.data.produtos)
                return out.data.produtos
            }catch(e){
                console.log("Erro: ",e)
            }    
        },
        async addProduto(editedItem){//vai virar um mixin
            try{ 
                const saida = await api.produto.addProduto(
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
        updateProduto(editedItem,produto_id){//a lvl de bd, serve tano pra editar uma linha qt pra criar uma, ja q uma linha é um objeto dentro de uma campanha
            var img_id = ''
            console.log("entradas ",editedItem, " id: ", produto_id)
            if(editedItem._id.data !== undefined)//primeira edicao apos criar algo existe um _id.data, nos outros casos apenas _id, entao cuidado
                img_id = editedItem._id.data
            else
                img_id = editedItem._id    
            api.produto.updateProduto({
                   produtos:editedItem,
                   produto_id,
                  // row_id:img_id
             }).then(
                   r => console.log("produto atualizado com sucesso")
             )
             .catch(e => console.log("erro: ",e))
        },
        removeProduto(path,produto_id){
            console.log("vejaa ",path)
             api.produto.removeProduto({
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
        },
    }
}    