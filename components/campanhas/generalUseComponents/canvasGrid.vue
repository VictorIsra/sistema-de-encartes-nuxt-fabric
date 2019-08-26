<template>
    <div>
        <v-layout>
         <v-btn-toggle v-model="checkGridAux" mandatory>
                                
                <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                            <v-btn color="primary" fab small dark v-on="on"  @click="removeGrid">
                                <v-icon>grid_off</v-icon>
                            </v-btn> 
                            </template>
                            <span class="subheading">Esconder grid</span>
                            </v-tooltip>
                        </div> 
                         <div> 
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                            <v-btn color="primary" fab small dark v-on="on"  @click="fillGrid" >
                                <v-icon>grid_on</v-icon>
                            </v-btn>
                            </template>
                            <span class="subheading">Mostrar grid</span>
                            </v-tooltip>
                </div> 
            </v-btn-toggle>
        </v-layout>
    </div>
</template>
<script>
import crudMixin from  '../../../components/mixins/CRUD.js'

export default {
    data: () => ({
       checkGridAux: undefined,
      gridGroup: null
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
        checkGrid:{
           default:function(){
               return undefined
           }
        },flag:{
            default:function(){
                return false
            }
        }
    },    
    mixins: [
      crudMixin
    ],
    watch:{
        flag(){
            this.checkGridAux = undefined
            if(this.flag)
                this.removeGrid()
        }
    },
    methods:{
    
     fillGrid(){
            if(this.gridGroup)
                return
            var gridoption = {
                stroke: 'black',
                strokeWidth: 2.5,
                distance: 10
            }
            var gridLines = [];
            let gridlen = this.canvas.ref.width > this.canvas.ref.height ?  this.canvas.ref.width :  this.canvas.ref.height
            for (var x = 1; x < (gridlen ); x += 100) {
                gridLines.push(new fabric.Line([x, 0, x, gridlen], gridoption));
          //  }
            //for (var x = 1; x < (this.canvas.height ); x += 30) {
                gridLines.push(new fabric.Line([0, x, gridlen, x], gridoption));
            }
            this.gridGroup = new fabric.Group(gridLines, {
                selectable: false,
                evented: false
            })
            this.gridGroup.addWithUpdate()
            this.canvas.ref.add(this.gridGroup)  
            //this.canvas.sendToBack(this.gridGroup)
            this.canvas.ref.bringToFront(this.gridGroup)

        },
        removeGrid(){
            console.log("eita ",this.checkGridAux)
            this.gridGroup && this.canvas.ref.remove(this.gridGroup)
            this.gridGroup = null
            //this.checkGrid = undefined

        } 

    }    
}
</script>
