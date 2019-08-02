<template>
     <v-layout justify-end>
        <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn class="mx-2" fab dark small color="primary"  v-on="on" @click="open">
                <v-icon dark>aspect_ratio</v-icon>
            </v-btn>
        </template>
        <span>Adicionar backgrounds</span>
        </v-tooltip>  
        
        <v-dialog v-model="dialog" persistent max-width="700">
            <v-card>
                <v-card-title class="headline primary--text">Configurações do canvas</v-card-title>
                <v-container grid-list-md >
                    <v-layout wrap>
                        <v-flex xs12 sm2 >
                            <div>
                        <v-text-field 
                                        label="Produto">
                        </v-text-field>
                            </div>
                        </v-flex>
                         <v-flex xs12 sm2 >
                            <div>
                        <v-text-field 
                                        label="Produto">
                        </v-text-field>
                            </div>
                        </v-flex>
                         <v-flex xs12 sm2 >
                            <div>
                        <v-text-field 
                                        label="Produto">
                        </v-text-field>
                         <v-text-field 
                                        label="Produto">
                        </v-text-field>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>           
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="close">Fechar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-layout>    
</template>
<script>
export default {/*px por miliemtro: Printers typically print at 300 pixels per inch.In millimeters: 300ppi / 25.4 mm-in = 11.81 pixels per millimeter.So if you want to print a 50mm drawing you would calculate the required pixel size like this:50mm x 11.81ppm = 590.5 pixels (591 pixels)And you resize the canvas to have 591 pixels (assuming square) like this: */
    data: () => ({
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
    }   
}
</script>
<style scoped>

</style>
