<template>
     <v-layout justify-end>
        <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn class="mx-2" fab dark size=big color="primary"  v-on="on" @click="open">
                <v-icon size=30 dark>stay_current_landscape</v-icon>
            </v-btn>
        </template>
        <span class="subheading">Configurações do canvas</span>
        </v-tooltip>  
        
        <v-dialog v-model="dialog" persistent max-width="550">
            <v-card>
                <v-layout class="justify-center">
                    <v-card-title class="headline primary--text">Configurações do canvas</v-card-title>
                </v-layout>
                <v-container grid-list-md >
                    <v-layout wrap class="justify-center">
                       <v-flex xs12 sm6>
                             <v-text-field
                                v-model="dpi"
                                disabled
                                label="DPI">
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-select
                                :items="folhas"
                                v-model="folha"
                                label="folha">
                            ></v-select>
                        </v-flex>
                          <v-flex xs12 sm6>
                      
                        <v-text-field  @change="checkDim"
                                        v-model="largura"
                                        label="Altura (mm)">
                        </v-text-field>
                        </v-flex>
                         <v-flex xs12 sm6>
                        <v-text-field   v-model="altura"  @change="checkDim" 
                                        label="Largura (mm)">
                        </v-text-field>
                        </v-flex>
                       
                            <div>
                            <v-btn color="primary" fab small dark @click="swap" >
                                <v-icon>compare_arrows</v-icon>
                            </v-btn>
                            </div> 
                      
                    </v-layout>
                </v-container>    
                <v-layout class="justify-center">       
                    <v-btn color="primary" class="mx-1" text @click="close">Cancelar</v-btn>
                    <v-btn color="primary" class="mx-1" text @click="save">Salvar</v-btn>
                </v-layout>    
            </v-card>
        </v-dialog>

    </v-layout>    
</template>
<script>
  import formatInputMixin from '../../mixins/FormatInputMixin.js'
import crudMixin from '../../mixins/CRUD.js'

export default {/*px por miliemtro: Printers typically print at 300 pixels per inch.In millimeters: 300ppi / 25.4 mm-in = 11.81 pixels per millimeter.So if you want to print a 50mm drawing you would calculate the required pixel size like this:50mm x 11.81ppm = 590.5 pixels (591 pixels)And you resize the canvas to have 591 pixels (astming square) like this: */
    data: () => ({
        folhas: ['A5','A4','A3','tabloid','A2'],//opcoes pre feitas de folhas
        folha: 'A4',//tipo de folha do canvas por default
        altura:210, // éa largura no menu lol eixo y em (mm) ? na real cm ac
        largura : 297,//eixo x em (mm) ? na real cm
        dpi: 300,//default q o jspdf gera, mas salverei posteriormenteo com 300, caso user queira.
        dialog: false,
        width: '',//caso ex de folha 10cm por 15 cm : wid = 10 cm *300 / 2.54 = 1181 pixels
        height: '',//15 //caso ex de folha 10cm por 15 cm : hei = 15 cm *300 / 2.54 = 1772 pixels
        fetchedFlag: false//indica se ja dei fetch no bd, p fazer so 1x
    }),
    mixins: [
      formatInputMixin,
      crudMixin
    ],
     props:
         ['canvas','campanha_id']
    ,    
    watch:{
            altura(){//NA REAL É LARGURA X
                 if(this.altura >= 594)
                     this.altura = 594
                // if(this.largura >= 457.2)
                //     this.largura = 457.2  
                
            },
            largura(){//NA REAL É ALTURA  Y
            //    if(this.altura >= 457.2)
                if(this.largura >= 594)
                    this.largura = 594    
            },
        folha(){

            if(this.folha === 'A3'){
                this.altura = 297,
                this.largura = 420//devia ser 1189
            }
            else if(this.folha === 'A4'){
                this.altura = 210,
                this.largura = 297//devia ser 1189
            }
            else if(this.folha === 'A5'){
                this.altura = 148,
                this.largura = 210//devia ser 1189
            }
          else if(this.folha === 'A2'){
                this.altura = 420,//altura na vdd é largura e vice versa
                this.largura = 594//devia ser 1189
            }
          
            else if(this.folha === 'tabloid'){
                this.altura = 304,
                this.largura = 457.2//devia ser 1189
            }
        }
    },
    mounted(){
       
        //this.init()
        this.save()
    },
    methods:{
        async checkid(){
            if(this.campanha_id !== undefined && !this.fetchedFlag){//garante fazer só 1x
                let folha = await this.loadTabloide(this.campanha_id)
                this.folha = folha.data.tabloide_folha
                this.fetchedFlag = true    
            }
           
        },
        swap(){//pportrait passa flag 0, land flag 1
            // if(this.chave != flag){
            //     this.chave = flag
                let aux = this.altura
                this.altura = this.largura
                this.largura = aux
           // }
           
        },
         getRealSize(){
            //tamanho real em mm
            this.$emit('getReal', {
                altura: this.largura,//ja q tao trocados, troco aki p n cascatear esse prob
                largura: this.altura,
                folha: this.folha.toLowerCase()
            })
            
        },
         checkMode(){
            if(this.altura >= 88){
                this.$emit('canvasmode',{
                data: {
                        mode: 'landscape'
                    }
                })
            }
            else{
                this.$emit('canvasmode',{
                data: {
                        mode: 'portrait'
                    }
                })
            }
        },
        checkDim(){
            if(this.altura * this.largura >= 841000){
                //o maior eixto recebera o vlaor max
                if(this.altura >= this.largura){
                    this.altura = 1000
                    this.largura = 841
                }else{
                    this.altura = 841
                    this.largura = 1000
                }
             }//n da p ser maior, se n dá overflow! 
             this.checkMode()
             this.getRealSize()
        },
        open(){
            this.checkid()
            this.dialog = true
        },
        close () {
            this.dialog = false
        },

        save(){
            this.genCanvasSize()
            this.checkDim()
            this.close()
        },
        genCanvasSize(){
            //calcula o tamanho do canvas em pixels basado na altura e largura passadas em mm
            //11.81 vem de  300ppi / 25.4mm = 11.81 pixels por mm  ja q impressao normal é de 30 pixels por inch
            //* 10 pq a formula é em cm, mas a entrada do user é  mm
            this.width =  ( this.largura * (300 / 2.54))/ 10//* 11.81//lol q bizarrroo
            this.height =   (this.altura * (300 /2.54))/10  //da o valor em pxs
                //this.canvas.setZoom(this.canvas.getZoom() / 1.5)
            this.$emit('resize-canvas',{
                data: {
                    width: this.width.toFixed(3),
                    height: this.height.toFixed(3),
                    folha: this.folha
                    }
            })
        }
    }   
}
</script>
<style scoped>

</style>
