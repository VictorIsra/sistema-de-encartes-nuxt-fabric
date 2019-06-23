<template>
    <div>
        <v-btn color="success" @click="criaRet">testa</v-btn>
        <canvas id="c"></canvas>
    </div>
</template>

<script>
import {fabric}  from "fabric"
//const canvas = new fabric.Canvas('c')


// "add" rectangle onto canvas

export default {
   data: () => ({
       canvas: ''
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
            this.canvas.add(rect)
        }
    }
}
</script>
