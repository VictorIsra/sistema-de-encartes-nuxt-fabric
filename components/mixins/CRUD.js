import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada
//fazer as req aqui, em vez de direto no componente. assim é mais organizado/modularizado
export default {
    methods: {
        addRow(editedItem){//vai virar um mixin
             api.campanha.addRow(
                   {produtos:editedItem,
                   campanha_id:"5d126668d0428d506c18cdaf"}
             ).then(r => editedItem._id = r)
             .catch(e => console.log("erro: ",e))
        },
        updateRow(editedItem){//a lvl de bd, serve tano pra editar uma linha qt pra criar uma, ja q uma linha é um objeto dentro de uma campanha
             api.campanha.updateRow({
                   produtos:editedItem,
                   campanha_id:"5d126668d0428d506c18cdaf",
                   row_id:editedItem._id
             }).then(
                   r => console.log("response: ",r)
             )
             .catch(e => console.log("erro: ",e))
        },
        removeRow(row_id,path){
             console.log("entrou app ", row_id, " e path ", path)
             api.campanha.removeRow({
                 campanha_id:"5d126668d0428d506c18cdaf",
                 row_id: row_id,
                 path: path //path da img que vou excluir ( lembre q excluir a linha é dif de excluir o path da img, sao operacoes dif)
             }).then(
               r => console.log("removido com sucesso: ",r)
             )
             .catch(e => console.log(e))
        },
        async getProdutos(campanha_id){
            console.log("entrei com ", campanha_id)
            try{
                const out = await api.campanha.getProdutos({
                    params: {
                        campanha_id
                    }
                })
                console.log("td azul: ", out)
                return out.data.produtos
            }catch(e){
                console.log("Erro: ",e)
            }    
        },
        async imgUpload(file,item){//faz o upload da img a lvl de bd
            //file é o this.editeItem.img.imgfile, o item é a ref real: this.editeItem
            const formData = new FormData()
            formData.append('upload',file)
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