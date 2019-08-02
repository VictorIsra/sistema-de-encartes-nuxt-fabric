<template>
    <div>
    <teste @resize-canvas="getDim"></teste>
    </div>
</template>
<script>
import canvasOption from '../components/campanhas/generalUseComponents/canvasOptions'// ../generalUseComponents/canvasOptions.vue'

export default {
    components:{
        'teste': canvasOption,

    },
     data: () => ({
         wi: '',
         hei: ''
    }) ,
    methods:{
        getDim(objeto){
            this.wi = objeto.data.width
            this.hei = objeto.data.height
        }
    }
    
}
</script>
