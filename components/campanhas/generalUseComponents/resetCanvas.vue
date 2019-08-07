<template>
    <div><v-tooltip bottom>
            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark v-on="on" @click="restoreDefault2">
                                <v-icon>restore</v-icon>
                            </v-btn>    
                            </template>
                            <span class="subheading">Setar canvas para posição e zoon originais</span>
                            </v-tooltip>
    </div>
</template>
<script>
export default {
    props:['canvas','flag'],
    watch:{
        flag(){
            this.restoreDefault2()
        }
    },
    methods:{
        restoreDefault2(){
            if(this.canvas !== undefined){
                this.restoreDefault()
                let auxwidth = this.canvas.width
                this.canvas.setZoom(this.canvas.getZoom() / (auxwidth /175) )
                var delta = new fabric.Point(400,0)
                this.canvas.relativePan(delta)
                var delta = new fabric.Point(0,20)
                this.canvas.relativePan(delta)
            }
        },  
        restoreDefault(){
            if(this.canvas !== undefined){
                this.canvas.setZoom(1)
                //reset o canvas para o status inicial
                this.canvas.setViewportTransform([1,0,0,1,0,0]) 
                this.canvas.renderAll()
            }
       },
    }
}
</script>
