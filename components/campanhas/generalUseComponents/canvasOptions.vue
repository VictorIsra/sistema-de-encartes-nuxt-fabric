<template>
     <v-layout justify-end>
        <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn class="mx-2" fab dark size=big color="primary"  v-on="on" @click="open">
                <v-icon dark>build</v-icon>
            </v-btn>
        </template>
        <span>Adicionar backgrounds</span>
        </v-tooltip>  
        
        <v-dialog v-model="dialog" persistent max-width="550">
            <v-card>
                <v-layout class="justify-center">
                    <v-card-title class="headline primary--text">Configurações do canvas</v-card-title>
                </v-layout>
                <v-container grid-list-md >
                    <v-layout wrap class="justify-center">
                        <div class="align-center">
                       <v-flex xs12 sm5>
                            <v-select
                                :items="dpisPossiveis"
                                v-model="dpi"
                                label="DPI">
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm5>
                            <v-select
                                :items="folhas"
                                v-model="folha"
                                label="folha">
                            ></v-select>
                        </v-flex>
                        </div>
                        <div>
                          <v-flex xs12 sm5>
                      
                        <v-text-field @change="checkDim"  v-model="largura"
                                        label="Altura (mm)">
                        </v-text-field>
                            
                        </v-flex>
                         <v-flex xs12 sm5 @change="checkDim">
                        <v-text-field   v-model="altura"
                                        label="Largura (mm)">
                        </v-text-field>
                        </v-flex>
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
export default {/*px por miliemtro: Printers typically print at 300 pixels per inch.In millimeters: 300ppi / 25.4 mm-in = 11.81 pixels per millimeter.So if you want to print a 50mm drawing you would calculate the required pixel size like this:50mm x 11.81ppm = 590.5 pixels (591 pixels)And you resize the canvas to have 591 pixels (assuming square) like this: */
    data: () => ({
        folhas: [   'tabloid','A5','A4','A3','A2','A2','A0'],//opcoes pre feitas de folhas
        folha: 'A4',//tipo de folha do canvas por default
        dpisPossiveis: [72,50,300],
        altura:210, // éa largura no menu lol eixo y em (mm) ? na real cm ac
        largura : 297,//eixo x em (mm) ? na real cm
        dpi: 72,//default q o jspdf gera, mas salverei posteriormenteo com 300, caso user queira.
        dialog: false,
        width: '',//caso ex de folha 10cm por 15 cm : wid = 10 cm *300 / 2.54 = 1181 pixels
        height: '',//15 //caso ex de folha 10cm por 15 cm : hei = 15 cm *300 / 2.54 = 1772 pixels
    }),
    watch:{
            // altura(){//NA REAL É LARGURA X
            // alert("Oo")
                
            // },
            // largura(){//NA REAL É ALTURA  Y
            //     this.checkDim()
            // },
        folha(){
            if(this.folha === 'A0'){
                this.altura = 841,
                this.largura = 1000//devia ser 1189
            }
            else if(this.folha === 'A1'){
                this.altura = 594,
                this.largura = 841//devia ser 1189
            }
            else if(this.folha === 'A2'){
                this.altura = 420,
                this.largura = 594//devia ser 1189
            }
            else if(this.folha === 'A3'){
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
          
            else if(this.folha === 'tabloid'){
                this.altura = 304,
                this.largura = 457.2//devia ser 1189
            }
        }
    },
    methods:{
         getRealSize(){
            //tamanho real em mm
            this.$emit('getReal', {
                altura: this.largura,//ja q tao trocados, troco aki p n cascatear esse prob
                largura: this.altura,
                folha: this.folha
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
            this.$emit('resize-canvas',{
                data: {
                    width: this.width.toFixed(3),
                    height: this.height.toFixed(3)
                    }
            })
        }
    }   
}
</script>
<style scoped>

</style>
