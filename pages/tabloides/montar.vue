<template>
        <v-card>
            <v-toolbar flat color="grey lighten-4">
                <v-toolbar-title>
                    <v-layout align-center class="mr-2 primary--text">
                        <v-btn round @click="voltar" color="primary">Voltar</v-btn>
                    </v-layout>
                </v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-card-title color="grey lighten-4" class="justify-center">
                    <div>
                        <v-btn round color="warning" @click="removeSelected">remover imagem selecionado</v-btn>
                    </div>
                </v-card-title>
                 <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-card-title color="grey lighten-4" class="justify-center">
                    <div>
                        <v-btn round @click="submeterAvaliacao" color="success">Submeter para avaliação</v-btn>
                    </div>
                </v-card-title>    
            </v-toolbar>
            <div class="text-xs-center">
                <canvas id="c" class="canvas" width="700px" height="900px"></canvas>
            </div>
            <ul>
                <li v-for="(img,i) in imgs" :key="i">
                    <img @click="addImg(img,i)" :src="getImgURL(img,i)" width="50px" height="50px" v-bind:alt="img.src">
                </li>
            </ul>    
          <!--  <img ref="img"  src="https://mambo.vteximg.com.br/arquivos/ids/236351/139860_Cha-Matte-Leao-100g.jpg?v=636741824864830000"> -->
        </v-card>
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
        itens: '',//imgs, futuramente texto..etc,
        imgs: [],
        campanha_id: undefined,
        imgsList: []
    }),
    mounted() {
        this.checkRedirect()
        this.canvas = new fabric.Canvas('c');
    },
    methods: {
        teste2(){
            console.log(this.canvas)
        },
        addImg(img,i){
            //console.log("adicionando img de indice ",i)
            const relaPath = "../../../uploads/fotos/" + img.name
            this.addImgToCanvas(relaPath,img)//parece estranho eu n passar simplesmente img, mas o fabric é eskisito...entao vai assim
        },
        submeterAvaliacao(){//envia tabloide/campanha para o diretor
            this.changeCampanhaStatus('em avaliação')
        },
        async changeCampanhaStatus(status){//irá mudar o status da campanha
            await this.updateStatus(this.campanha_id,status)
            this.$router.push('/tabloides')
        },
        voltar(){
            this.$router.push('/tabloides')
        },
        checkRedirect(){//se tentar acessar essa pag sem existir uma campanha associada, redirecionar
        this.campanha_id = this.$route.params.campanha_id
        if(this.campanha_id === undefined)
            this.$router.push('/tabloides')
        else
            this.fetchProdutos()//console.log("ID: ", this.campanha_id)     
        },
        async fetchProdutos(){
            this.itens = await this.getProdutos(this.campanha_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            const imgs = this.itens.forEach(p => {
                if(p.img !== undefined && p.img !== '')
                    this.imgs.push(p.img)
            })
            console.log("lala ",this.imgs)
        },
        getImgURL(img){
        //se uma img nao tiver sido escolhida, retorne enm branco
        const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
        return path
        },
        //METODOS RELATIVOS AO CANVAS/FABRIC
        removeSelected(){//remove do canvas o objeto que está selecionado
            if(this.canvas.getActiveObject() !== undefined){
                let doomedObj = this.canvas.getActiveObject();

                if (doomedObj.type === 'activeSelection') {
                    //lembre de arro f pra referenciar o this sem ko
                    doomedObj.canvas = this.canvas
                    doomedObj.forEachObject((obj) => {
                        this.canvas.remove(obj);
                    });
                }//endif multiple objects
                else{
                //unico objeto
                var activeObject = this.canvas.getActiveObject();
                    if(activeObject !== null ) {
                        this.canvas.remove(activeObject);
                    }
                }
                        
            } 
        },
        addImgToCanvas(path,img){//fabric salvará essas imgs e poderei as referencias
            //img.name é o path da img rs
            fabric.Image.fromURL(path,(img)=>{
                let temp = img.set({ left: 0, top: 0 })//,width:500,height:500})
                this.canvas.add(temp)
            },{canvas: this.canvas})//n funciona passar esse arg...doc lixoooo
        },
    }
}
</script>

<style scoped>
.canvas {
    border:1px solid black;
   
	
}

</style>


