<template>
    <div>
        <v-layout>
         <div> 
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark @click="agrupa" v-on="on" >
                                <v-icon>present_to_all</v-icon>
                            </v-btn> 
                            </template>
                            <span class="subheading">Agrupar seleção em um único elemento</span>
                            </v-tooltip>
                        </div> 
                         <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark @click="desagrupa" v-on="on">
                                <v-icon>no_sim</v-icon> 
                            </v-btn>        
                            </template>
                            <span class="subheading">Separar elemento em elementos individuais</span>
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
        agrupa(){
            //agrupa selecoes
            if(this.canvas.ref !== undefined){
                if (!this.canvas.ref.getActiveObject()) {
                    return
                }
                if (this.canvas.ref.getActiveObject().type !== 'activeSelection') {
                    return
                }
                this.canvas.ref.getActiveObject().toGroup();
                this.canvas.ref.requestRenderAll();
            }

        },
        desagrupa(){
            if(this.canvas.ref !== undefined){
                if (!this.canvas.ref.getActiveObject()) {
                    return
                }
                if (this.canvas.ref.getActiveObject().type !== 'group') {
                    return
                }
                this.canvas.ref.getActiveObject().toActiveSelection()
                this.canvas.ref.requestRenderAll()
            }
        },
    }    
}
</script>
