<template>
    <div>     <div class="text-center ma-2">
            <v-snackbar class="justify-end"
            v-model="snackBar.snackbar"
              :timeout="snackBar.timeout"
            >
            <span class="subheading">
            {{ snackBar.text }}</span>
       
        </v-snackbar>
        </div>            
        <v-layout>
          <div> 
                           <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark @click="copy" v-on="on">
                                <v-icon>fa-copy</v-icon>
                            </v-btn> 
                            </template>
                            <span class="subheading">Copiar elemento(s) selecionado(s)</span>
                            </v-tooltip>
                        </div>
                         <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark @click="paste" v-on="on">
                                <v-icon>fa-clipboard</v-icon>
                            </v-btn>
                            </template>
                            <span class="subheading">Colar elemento(s) copiados(s)</span>
                            </v-tooltip>
                        </div>
            
        </v-layout>
        
    </div>
</template>
<script>
import crudMixin from  '../../../components/mixins/CRUD.js'

export default {
    data: () => ({
        clipboard: '',
         snackBar:{
            color: '',
            mode: '',
            snackbar: false,
            text: 'Elementos copiados com sucesso',
            timeout: 1500,
            x: null,
            y: 'top',
        },
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
        copy(){
            if(this.canvas.ref !== undefined){
                if(this.canvas.ref.getActiveObject() !== undefined && this.canvas.ref.getActiveObject() !== null){
                    this.canvas.ref.getActiveObject().clone(cloned => {
                        this.clipboard = cloned
                    })
                       this.snackBar.text = "Elemento(s) copiado(s) com sucesso!"
                this.snackBar.snackbar = true
                setTimeout(()=>this.snackBar.snackbar = false,this.snackBar.timeout)
                console.log("clip ",this.clipboard)
                }
            }
           
        },
        paste(){
            if(this.clipboard === '' || (this.clipboard === undefined))
                return
            this.clipboard.clone(clonedObj => {
                if(this.canvas.ref !== undefined){
                        this.canvas.ref.discardActiveObject();
                        clonedObj.set({
                            left: clonedObj.left + 10,
                            top: clonedObj.top + 10,
                            evented: true,
                        });
                        if (clonedObj.type === 'activeSelection') {
                            // active selection needs a reference to the canvas.
                            clonedObj.canvas = this.canvas.ref
                            clonedObj.forEachObject(obj => {
                                this.canvas.ref.add(obj)
                            })
                            // this should solve the unselectability
                            clonedObj.setCoords();
                        } else {
                            this.canvas.ref.add(clonedObj);
                        }
                        this.snackBar.text = "Elemento(s) colado(s) com sucesso!"
                          this.snackBar.snackbar = true
                        setTimeout(()=> this.snackBar.snackbar = false,this.snackBar.timeout)
                        this.clipboard.top += 10;
                        this.clipboard.left += 10;
                        this.canvas.ref.setActiveObject(clonedObj);
                        this.canvas.ref.requestRenderAll();
                    }       
                });
                
        },
    }    
}
</script>
