<template>
    <div>
        <v-layout>
            <div>
                <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" v-on="on" fab small dark @click="Xmovement(-1)">
                                <v-icon>arrow_back</v-icon>
                            </v-btn>
                            </template>
                            <span class="subheading">Mover canvas 1 unidade para esquerda</span>
                            </v-tooltip>
                        </div>
                        <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small v-on="on" dark @click="Xmovement">
                                <v-icon>arrow_forward</v-icon>
                            </v-btn></template>
                            <span class="subheading">Mover canvas 1 unidade para direita</span>
                            </v-tooltip>
                        </div>
                        <div> <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small v-on="on" dark @click="Ymovement(-1)">
                                <v-icon>arrow_upward</v-icon>
                            </v-btn>
                            </template>
                            <span class="subheading">Mover canvas 1 unidade para cima</span>
                            </v-tooltip>
                        </div>
                        <div> <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small v-on="on" dark @click="Ymovement">
                                <v-icon>arrow_downward</v-icon>
                            </v-btn>
                               </template>
                     <span class="subheading">Mover canvas 1 unidade para baixo</span>
                 </v-tooltip>
            </div>
    
        </v-layout>
        
    </div>
</template>
<script>

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
    methods:{
     
         Xmovement(flag = 0){//andar p direita ou esuqer
            if(this.canvas.ref !== undefined){
                var units = 10//caso direita
                if(flag === -1)//caso esquerda
                    units = -units
                var delta = new fabric.Point(units,0)
                this.canvas.ref.relativePan(delta)
            }
            
        },
        Ymovement(flag = 0){//andar p cima ou p baixo
            if(this.canvas.ref !== undefined){
                var units = 10//caso p baixo
                if(flag === -1)//caso cima
                    units = -units
                var delta = new fabric.Point(0,units)
                this.canvas.ref.relativePan(delta)
            } 
        }
    
    }
    
}
</script>
