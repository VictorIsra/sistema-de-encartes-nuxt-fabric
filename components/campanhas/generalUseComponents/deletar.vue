<template>
    <div>
        <v-layout>
      <div> 
                             <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="red" fab small v-on="on" dark @click="deletar">
                                <v-icon>clear</v-icon>   
                            </v-btn>
                            </template>
                            <span class="subheading">Deletar elemento(s) selecionados(s)</span>
                            </v-tooltip>
                        </div> 
        </v-layout>
        
    </div>
</template>
<script>
import crudMixin from  '../../../components/mixins/CRUD.js'

export default {
    data: () => ({
        
    }),
    props: {
         canvas: {//tabela precisa q as datas fiquem dentro de um intervalo, daí ela envia essa prop preenchida
          type: Object,
          default: function(){
            return{
              ref: undefined,
              campanha_id: undefined,
              flag:undefined
            }  
          }
        },
    },    
    mixins: [
      crudMixin
    ],
    methods:{
       deletar(){
            if(this.canvas.ref.getActiveObject() !== undefined && this.canvas.ref.getActiveObject() !== null){
            //agrupa selecoes
            let doomedObj = this.canvas.ref.getActiveObject();
                if (doomedObj.type === 'activeSelection') {
                    //varios object selecinados
                    doomedObj.canvas = this.canvas
                       doomedObj.forEachObject((obj) => {
                            this.canvas.ref.remove(obj)
                        })
                }else{
                    var activeObject = this.canvas.ref.getActiveObject();
                    if(activeObject !== null ) {
                        this.canvas.ref.remove(activeObject)
                        this.canvas.ref.    renderAll()
                    }
                }
                this.canvas.ref.discardActiveObject()
            }

        },
    }    
}
</script>
