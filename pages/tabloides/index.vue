<template>
    <div >
        <v-btn round color="primary" @click="criaRet">testando tabloide funcionalidade basica (debug mode )</v-btn>
        <div class="text-xs-center">
            <canvas id="c" class="canvas" width="700px" height="900px"></canvas>
        </div>    
        <img ref="img" height="42" width="42" src="https://mambo.vteximg.com.br/arquivos/ids/236351/139860_Cha-Matte-Leao-100g.jpg?v=636741824864830000">

    </div>
</template>

<script>
import {fabric}  from "fabric"
//const canvas = new fabric.Canvas('c')


// "add" rectangle onto canvas

export default {
   data: () => ({
       canvas: '',
       img: ''
    }),
    mounted() {
       console.log("iii")
       this.canvas = new fabric.Canvas('c');
    },
    methods: {
        criaRet(){
            var rect = new fabric.Rect({
                left: 100,
                top: 100,
                fill: 'red',
                width: 20,
                height: 20
            });
            console.log("Uem é img ", this.$refs["img"])
            const img = new fabric.Image(this.$refs["img"], {
                    left: 200,
                    top: 200,
                    angle: 0,
                    opacity: 1
                });
            this.canvas.add(rect)
            this.canvas.add(img)
        }
    }
}
</script>

<style scoped>
.canvas {
    border:1px solid black;
   
	
}

</style>


