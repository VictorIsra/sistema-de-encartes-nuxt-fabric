import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada
//fazer as req aqui, em vez de direto no componente. assim é mais organizado/modularizado
export default {
    methods: {
        removeImgs(produtos){//msm uma campanha recem criada terá o vetor de produtos como um array de lengh 0, e portante o foreach sera ignorado nesse caso
            produtos.forEach(produto => {
                if(produto.img.src !== undefined){//caso exista a img nesse objeto, remova-a
                    api.campanha.dropImg({//n senti dif na performance mas, caso sinta, adaptar dropImg para iterar a lvl de server e n de app, assim evito multiplas req
                        path: produto.img.src
                    })
                }
            })        
        },
        removeImg(path){//remove uma unica img. util na hr de remover bg
            if(path !== '' && path !== undefined)
                api.campanha.removeImg({path})
                alert("dropeiii")
        },
        async removeCampanha(campanha_id,produtos){
            try{
               // await this.removeImgs(produtos) n mais ja que agora as imgs sao pegas da base de produtos
                //console.log("imgs removidas,agora irei remover campanah de id ", campanha_id)
                api.campanha.removeCampanha({
                    campanha_id
                })
                .then(r => console.log("campanha removida com sucesso! "))
                .catch(e => console.log("n pude remover campanha..."))
            }
            catch(e){
                console.log("nao pude remove imgs")
            }  
        },
        async createCampanha(campanhaInfos){
            try{
                console.log("entrooou create campanha")
                const newCampanha = await api.campanha.createCampanha(campanhaInfos)
                console.log("vai retornar: ", newCampanha)
                return newCampanha.data.campanha_id
            }catch(e){
                console.log("errorrr: ",e)
            }
        },
        async fetchCampanhas(campanha_id){
            //se campanha_id for undefined, pegara info de tds as campanhas, se naom pegará de uma em particular ( td isso ocorrerá a lvl de bd)
            try{
                const infos = await api.campanha.getGeneralInfo({
                    params:{
                        campanha_id
                    }
                })
                return infos.data.campanhas
            }catch(e){
                console.log("erro: ",e)
            }
        },
        async loadTabloide(id){
            try{    
                const tabloide = api.campanha.loadTabloide({
                    params:{
                        campanha_id: id
                    }
                })
                return tabloide
            }
            catch(e){
                console.log("n consegui carregar tabloide")
            }
        },
        saveTabloide(tabloide,id,bg = undefined,folha = 'a4'){
            api.campanha.saveTabloide({
                tabloide,
                id,
                bg,
                folha
            }).then(r => console.log(" SALVO CANVAS"))
            .catch( e => console.log("af e"))
        },
        async updateStatus(id,status,demanda_criada = false){
            try{
                console.log("entrei id e status ", id , status)
                const campanhaAtualizada = await api.campanha.updateStatus({
                    id,
                    status,
                    demanda_criada
                })
                console.log("saida ",campanhaAtualizada)
                return campanhaAtualizada.data
            }catch(e){
                console.log("zika updatestauts ",e)
            }
        },
        async addRow(editedItem,campanha_id){//vai virar um mixin
            try{ 
               const saida = await api.campanha.addRow(
                    {produtos:editedItem,
                    campanha_id}
                )
                console.log("retornarei ", saida.data.row_id)
                return saida.data.row_id
            }
            catch(e){
                console.log('erro ao tenta add linha ',e)
            }    
        },
        updateRow(editedItem,campanha_id){//a lvl de bd, serve tano pra editar uma linha qt pra criar uma, ja q uma linha é um objeto dentro de uma campanha
            var img_id = ''
            console.log("entradas ",editedItem, " id: ", campanha_id)
            if(editedItem._id.data !== undefined)//primeira edicao apos criar algo existe um _id.data, nos outros casos apenas _id, entao cuidado
                img_id = editedItem._id.data
            else
                img_id = editedItem._id    
            api.campanha.updateRow({
                   produtos:editedItem,
                   campanha_id,
                   row_id:img_id
             }).then(
                   r => console.log("linha atualizada com sucesso")
             )
             .catch(e => console.log("erro: ",e))
        },
        removeRow(row_id,path,campanha_id){
             api.campanha.removeRow({
                 campanha_id,
                 row_id: row_id,
                 path: path //path da img que vou excluir ( lembre q excluir a linha é dif de excluir o path da img, sao operacoes dif)
             }).then(
               r => console.log("removido com sucesso: ")
             )
             .catch(e => console.log(e))
        },
        async getProdutos(campanha_id){
            try{
                const out = await api.campanha.getProdutos({
                    params: {
                        campanha_id
                    }
                })
                return out.data.produtos
            }catch(e){
                console.log("Erro: ",e)
            }    
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