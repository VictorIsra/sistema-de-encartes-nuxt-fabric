<template>
    <v-layout > 
        <v-flex xs12>
            <v-overflow-btn 
                label="FONTE"
                hide-details
                class="pa-0"
                v-model="fontFamily"
                :items='fonts'
                dense
            ></v-overflow-btn>
        </v-flex>
        <v-flex >
            <v-overflow-btn
                :items="fontSizes"
                editable
                v-model="fontSize"
                label="Tamanho da fonte"
                hide-details
                class="pa-0"
                overflow
            ></v-overflow-btn>
        </v-flex>
        <v-flex xs6>
            <v-overflow-btn
                :items="bordas"
                editable
                v-model="border"
                label="grossura das bordas"
                hide-details
                class="pa-0"
                overflow
            ></v-overflow-btn>
        </v-flex> <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="white grey--text" fab small dark @click="manageFonts('border_color')" v-on="on">
                                <v-icon size=30>format_color_fill</v-icon>
                            </v-btn>
                            </template>
                            <span class="subheading">Aplicar cor selecionada à borda da(s) seleção(s)</span>
                            </v-tooltip>
                        </div>  
    </v-layout>   
</template>
<script>
export default {
    props: ['canvas','flag','colors'],
    data: () => ({
        fontSize: '200',
        fontFamily:  'PT Serif',
        border: '0',//grossura da borda em px
        bordas: [
            {text : '0',},
            {text: '2',},
            {text: '4',},
            {text: '6',},
            {text: '8',},
            {text: '10',},
        ],
        fonts: [ 'PT Serif','Times New Roman',"Roboto", 'Literata' , 'Oswald', "Inconsolata",'Josefin Sans','Indie Flower','Amiri','Rokkitt'],
        fontSizes: [
            {text: '10' },
            { text: '20' },
            { text: '30' },
            { text: '40' },
            { text: '50' },
            { text: '60' },
            { text: '70' },
            { text: '80' },
            { text: '90' },
            { text: '100' },
            { text: '200' },
            { text: '300' },
            { text: '400' },
            { text: '500' }
        ]     
    }),
    watch:{
        fontSize(){
            this.manageFonts('fontSize')
        },
        fontFamily(){
            this.manageFonts('fontFamily')
        },
        border(){
            this.manageFonts('border')
        },
        flag(){
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                if(this.canvas.getActiveObject().text !== undefined){//exclusivo p texto
                    this.fontSize = this.canvas.getActiveObject().fontSize.toString()
                    this.fontFamily = this.canvas.getActiveObject().fontFamily
                    this.border = this.canvas.getActiveObject().strokeWidth
                } //só textos passam desse teste, imgs sao object active, mas retornam undefined para esse atributo
            }
        }
        
    },
    methods: {
        manageFonts(event){
            if(this.canvas !== undefined){
                if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){

                   let doomedObj = this.canvas.getActiveObject()
                    if (doomedObj.type === 'activeSelection') {
                        doomedObj.canvas = this.canvas
                        if(event === 'fontSize'){
                            doomedObj.forEachObject((obj) => {
                                obj.set("fontSize", this.fontSize.toString())
                            })
                        }
                        else if(event === 'fontFamily'){
                            doomedObj.forEachObject((obj) => {
                                obj.set("fontFamily", this.fontFamily)
                                this.canvas.renderAll()
                                this.canvas.setZoom(this.canvas.getZoom() / 1.1 )
                            })
                        }
                         else if(event === 'border'){
                            doomedObj.forEachObject((obj) => {
                                
                                obj.set('strokeWidth', parseInt(this.border))
                                let cor = this.colors
                                if(typeof(this.colors) === 'object'){
                                    cor = this.colors.hex8
                                }                                
                                obj.set('stroke','black')

                            })
                        }
                        else if (event === 'border_color'){
                            doomedObj.forEachObject((obj) => {
                              
                                 let cor = this.colors
                                if(typeof(this.colors) === 'object'){
                                    cor = this.colors.hex8
                                }                                
                                obj.set('stroke',cor)
                            })
                        }
                    }
                    else{
                        var activeObject = this.canvas.getActiveObject();
                        if(activeObject !== null ) {
                            if(event === 'fontSize'){
                                this.canvas.getActiveObject().set("fontSize", this.fontSize.toString())
                            } 
                            else if(event === 'fontFamily'){
                                this.canvas.getActiveObject().set("fontFamily", this.fontFamily)
                                this.canvas.renderAll()
                                this.canvas.setZoom(this.canvas.getZoom() / 1.1 )
                            }
                            else if(event === 'border'){
                                this.canvas.getActiveObject().set('strokeWidth',parseInt(this.border) )
                                this.canvas.getActiveObject().set('stroke','black')

                           }
                            else if (event === 'border_color'){
                                let cor = this.colors
                                if(typeof(this.colors) === 'object'){
                                    cor = this.colors.hex8
                                }                                
                                this.canvas.getActiveObject().set('stroke',cor)
                            }
                        }
                    }  
                    this.canvas.renderAll()
                }
            }
        }
    }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Bahianita|PT+Serif|Darker+Grotesque|Indie+Flower|Josefin+Sans|Literata|Oswald|Roboto|Amiri|Cinzel|Patua+One|Permanent+Marker|Righteous|Rokkitt|Vollkorn&display=swap');

</style>
