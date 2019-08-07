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
        <v-flex xs12>
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
    </v-layout>   
</template>
<script>
export default {
    props: ['canvas','flag'],
    data: () => ({
        fontSize: '200',
        fontFamily:  'PT Serif',
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
            alert("Mudei")
            this.manageFonts('fontFamily')
        },
        flag(){
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                if(this.canvas.getActiveObject().text !== undefined)//exclusivo p texto
                    this.fontSize = this.canvas.getActiveObject().fontSize.toString()
                    this.fontFamily = this.canvas.getActiveObject().fontFamily //só textos passam desse teste, imgs sao object active, mas retornam undefined para esse atributo
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
