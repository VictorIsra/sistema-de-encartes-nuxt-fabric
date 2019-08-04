<template>
    <div>
        <v-layout>
       <div>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn color="warning" v-on="on" fab medium dark  @click="salvarTabloide">
                    <v-icon size=40>save</v-icon>
                    </v-btn>    
                </template>
                <span class="subheading">Salvar alterações feitas no tablóide</span>
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
        async salvarTabloide(){
            //this.checkGrid = false
            //await this.removeGrid()
            if(this.canvas.ref !== undefined && this.canvas.campanha_id !== undefined){
                alert("salvarei")
                var json = JSON.stringify(this.canvas.ref.toJSON())
                if(this.canvas.flag)//this.currBg !== '')
                    this.saveTabloide(json,this.canvas.campanha_id,this.canvas.flag)
                else
                    this.saveTabloide(json,this.canvas.campanha_id)
                console.log("salvo com sucesso.")
            }
            else
               console.log("n pude salvar tabloide <componente pdfhandler.vue>")
           
        }, 
    }    
}
</script>
