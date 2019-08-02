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
        
        <v-dialog v-model="dialog" persistent max-width="350">
            <v-card>
                <v-layout class="justify-center">
                    <v-card-title class="headline primary--text">Configurações do canvas</v-card-title>
                </v-layout>
                <v-container grid-list-md >
                    <v-layout wrap class="justify-center">
                       <v-flex xs12 sm2>
                            <v-select
                                :items="dpisPossiveis"
                                v-model="dpi"
                                label="DPI">
                            ></v-select>
                            </v-flex>
                         <v-flex xs12 sm2 >
                            <div> 
                        <v-text-field  size=10 v-model="largura"
                                        label="Largura">
                        </v-text-field>
                            </div>
                        </v-flex>
                         <v-flex xs12 sm2 >
                            <div>
                        <v-text-field   v-model="altura"
                                        label="Altura">
                        </v-text-field>
                            </div>
                        </v-flex>
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
        dpisPossiveis: [72,50,300],
        altura:28, //eixo y em (mm)
        largura : 20,//eixo x em (mm)
        dpi: 72,//default q o jspdf gera, mas salverei posteriormenteo com 300, caso user queira.
        dialog: false,
        width: '',//caso ex de folha 10cm por 15 cm : wid = 10 cm *300 / 2.54 = 1181 pixels
        height: '',//15 //caso ex de folha 10cm por 15 cm : hei = 15 cm *300 / 2.54 = 1772 pixels
    }) ,
    
    methods:{
        open(){
            this.dialog = true
        },
        close () {
            this.dialog = false
        },
        save(){
            this.genCanvasSize()
        },
        genCanvasSize(){
            //calcula o tamanho do canvas em pixels basado na altura e largura passadas em mm
            //11.81 vem de  300ppi / 25.4mm = 11.81 pixels por mm  ja q impressao normal é de 30 pixels por inch
            this.width = this.largura * 11.81
            this.height = this.altura * 11.81
            alert("vai emit")
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
