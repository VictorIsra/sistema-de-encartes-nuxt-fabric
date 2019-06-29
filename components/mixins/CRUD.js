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
             console.log(" te ",typeof(editedItem._id.data))
             api.campanha.updateRow({
                   produtos:editedItem,
                   campanha_id:"5d126668d0428d506c18cdaf",
                   row_id:editedItem._id.data
             }).then(
                   r => console.log("response: ",r)
             )
             .catch(e => console.log("erro: ",e))
        },
        removeRow(row_id){
             console.log("entrou app ", row_id)
             api.campanha.removeRow({
                 campanha_id:"5d126668d0428d506c18cdaf",
                 row_id: row_id
             }).then(
               r => console.log("removido com sucesso: ",r)
             )
             .catch(e => console.log(e))
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