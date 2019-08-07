<template>
    <v-layout>
        <v-flex class="mx-1">
            <span class="subheading indigo--text mx-1">Escala X:</span>
        </v-flex>
        <v-flex >
            <span class="subheading indigo--text"> {{elScale.x.toFixed(3)}}</span>
        </v-flex>
        <v-flex class="mx-1">
            <span class="subheading indigo--text">Escala Y:</span>
        </v-flex >
        <v-flex>
            <span class="subheading indigo--text ">{{elScale.y.toFixed(3)}}</span>
        </v-flex>
    </v-layout>                   
</template>
<script>
export default {
    props: ['canvas','flag'],
    data: () => ({
    
        elScale: {//serve pra ver a escala do elemento selecionado, "seu tamanho"
           x: 1,
           y: 1
       },
    }),
    watch:{
        flag(){
           if(this.canvas !== undefined){
                if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                    this.elScale.x = this.canvas.getActiveObject().scaleX
                    this.elScale.y = this.canvas.getActiveObject().scaleY
                }     
            }
        }
    }
}
</script>
