<template>
        <v-card>
           <!-- <v-carousel  :cycle="false" v-if="render">
                <v-carousel-item 
                v-for="(item,i) in imgs" :key="i"
                :src="getImgURL(item,i)"
                 @click="addImg(item,i)"
                ></v-carousel-item>
            </v-carousel> -->
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
                        <v-btn round color="warning" @click="removeSelected">remover imagem selecionada</v-btn>
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
                <v-toolbar-title>
                    <v-layout align-center class="mr-2 primary--text">
                        <v-btn round @click="salvarPdf" color="primary">Salvar em pdf</v-btn>
                    </v-layout>
                </v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
            </v-toolbar>
            <v-toolbar>
                    <v-list class="scroll-y">
                        <v-list-tile v-for="(img,i) in imgs" :key="i" class="teste" >
                            <v-list-tile-content>
                                <img class="image" @click="addImg(img,i)" :src="getImgURL(img,i)" width="100px" height="100px" v-bind:alt="img.src">
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
            </v-toolbar>
            <canvas id="c" class="canvas" width="1000px" height="1000px"></canvas>
           <!-- <ul>
                <li v-for="(img,i) in imgs" :key="i">
                    <img class="image" @click="addImg(img,i)" :src="getImgURL(img,i)" width="50px" height="50px" v-bind:alt="img.src">
                </li>
            </ul> -->
        </v-card>
</template>

<script>
import crudMixin from '../../components/mixins/CRUD.js'
import jsPDF from "jspdf"
import {fabric}  from "fabric"

export default {
    mixins: [
      crudMixin
    ],
   data: () => ({
        render: false,//só dps de carregar as imgs!
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
            this.itens.forEach(p => {
                if(p.img !== undefined && p.img !== '')
                    this.imgs.push( p.img)
            })
            //por alguma razao mt louca, se n espero um pouco, o caroulse n consegue carrega tds as imgs e da zika..mas usei await..enfim...se fuder
            //setTimeout(()=>{console.log("esperei")
            //this.render = true}, 500);
            
        },
        getImgURL(img){
        //se uma img nao tiver sido escolhida, retorne enm branco
        const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
        return path
        },
        salvarPdf(){
            const context = this.canvas.getContext('2d')
            // only jpeg is supported by jsPDF
            var imgData = this.canvas.toDataURL("image/jpeg", 1.0)
            var pdf = new jsPDF("1","mm","a4")
            pdf.addImage(imgData, 'JPEG', 10, 10, 180, 150)
            pdf.save("download.pdf");
        },
        //METODOS RELATIVOS AO CANVAS/FABRIC
        addImg(img,i){
            //console.log("adicionando img de indice ",i)
            const relaPath = "../../../uploads/fotos/" + img.name
            this.addImgToCanvas(relaPath,img)//parece estranho eu n passar simplesmente img, mas o fabric é eskisito...entao vai assim
        },
         addImgToCanvas(path,img){//fabric salvará essas imgs e poderei as referencias
            //img.name é o path da img rs
            fabric.Image.fromURL(path,(img)=>{
                img.scaleToWidth(250)
                img.scaleToHeight(250)
                let temp = img.set({ left: 0, top: 0 })//,width:500,height:500})
                this.canvas.add(temp)
            },{canvas: this.canvas})//n funciona passar esse arg...doc lixoooo
        },
        removeSelected(){//remove do canvas o objeto que está selecionado
            if(this.canvas.getActiveObject() !== undefined){
                let doomedObj = this.canvas.getActiveObject();

                if (doomedObj.type === 'activeSelection') {
                    //lembre de arro f pra referenciar o this sem ko
                    doomedObj.canvas = this.canvas
                    doomedObj.forEachObject((obj) => {
                        this.canvas.remove(obj);
                    });
                }
                else{
                //um unico objeto selecionado
                var activeObject = this.canvas.getActiveObject();
                    if(activeObject !== null ) {
                        this.canvas.remove(activeObject);
                    }
                }
                        
            } 
        }
    }
}

// .image {
//   display: block;
//   width: 10%;
//   height: auto;
// }
</script>

<style scoped>
.canvas {
    border:1px solid black;	
}
.teste{
    float: left;
    padding: 2px
}

li img:hover {
  background-color: #111111;
}

</style>


