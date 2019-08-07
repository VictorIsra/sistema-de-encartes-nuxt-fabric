<template>
    <v-flex xs3>
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
</template>
<script>
export default {
    props: ['canvas','flag'],
    data: () => ({
        fontSize: '200',
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
            this.manageFontSize('fontSize')
        },
        flag(){
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                if(this.canvas.getActiveObject().text !== undefined)//exclusivo p texto
                    this.fontSize = this.canvas.getActiveObject().fontSize.toString()
            }
        }
        
    },
    methods: {
        manageFontSize(event){
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
                    }
                    else{
                        var activeObject = this.canvas.getActiveObject();
                        if(activeObject !== null ) {
                            if(event === 'fontSize'){
                                this.canvas.getActiveObject().set("fontSize", this.fontSize.toString())
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
<style>

</style>
