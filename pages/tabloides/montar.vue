<template>
    <div >
        <v-btn round @click="submeterAvaliacao" color="primary">Submeter tablóide para avaliação</v-btn>
        <v-btn round color="primary" @click="criaRet">testando tabloide funcionalidade basica (debug mode )</v-btn>
        <div class="text-xs-center">
            <canvas id="c" class="canvas" width="700px" height="900px"></canvas>
        </div>    
        <img ref="img"  src="https://mambo.vteximg.com.br/arquivos/ids/236351/139860_Cha-Matte-Leao-100g.jpg?v=636741824864830000">

    </div>
</template>

<script>
import crudMixin from '../../components/mixins/CRUD.js'

import {fabric}  from "fabric"
//const canvas = new fabric.Canvas('c')


// "add" rectangle onto canvas

export default {
    mixins: [
      crudMixin
    ],
   data: () => ({
        canvas: '',
        img: '',
        campanha_id: undefined
    }),
    mounted() {
        this.checkRedirect()
        this.canvas = new fabric.Canvas('c');
    },
    methods: {
        submeterAvaliacao(){//envia tabloide/campanha para o diretor
            this.changeCampanhaStatus('em avaliação')
        },
        async changeCampanhaStatus(status){//irá mudar o status da campanha
            await this.updateStatus(this.campanha_id,status)
            this.$router.push('/tabloides')
        },
        checkRedirect(){//se tentar acessar essa pag sem existir uma campanha associada, redirecionar
        this.campanha_id = this.$route.params.campanha_id
        if(this.campanha_id === undefined)
            this.$router.push('/tabloides')
        else
            console.log("ID: ", this.campanha_id)     
        },
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


