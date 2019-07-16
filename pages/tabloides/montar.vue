<template>
        <v-card class="teste">
            <template v-if="userType === 'tabloide'">
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
                        <div>
                            <v-btn round @click="submeterAvaliacao" color="success">Submeter para avaliação</v-btn>
                        </div>
                        <v-layout align-center class="mr-2 primary--text">
                                <v-btn  round @click="salvarPdf(checkbox)" color="primary">{{salvarComo}}</v-btn>
                            <v-layout class="justify-end">
                                <v-checkbox
                                v-model="checkbox"
                                ></v-checkbox>
                            </v-layout>
                            <v-layout class="justify-end">
                                <v-checkbox
                                v-model="tobg"
                                ></v-checkbox>
                            </v-layout>      
                        </v-layout>
                        <v-divider
                            class="mx-2"
                            inset
                            vertical
                        ></v-divider>
                        <v-layout align-center class="mr-2 primary--text">
                            <v-btn round @click="salvarTabloide" color="primary">Salvar tabloide</v-btn>
                        </v-layout>
                </v-toolbar>
                <v-toolbar>
                        <v-list class="scroll-y">
                            <v-list-tile v-for="(img,i) in imgs" :key="i" class="listaHorizontal" >
                                <v-list-tile-content><!-- context menu é o botao direto, fundamental p n da merda-->
                                    <img class="image" @contextmenu.prevent @click="addImg(img,i)" :src="getImgURL(img,i)" width="100px" height="100px" v-bind:alt="img.src">
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                </v-toolbar>
            </template>
            <template v-else>
                <v-toolbar flat color="grey lighten-4">
                    <v-toolbar-title>
                        <v-layout align-center class="mr-2 primary--text">
                            <v-btn round @click="voltar" color="primary">Voltar</v-btn>
                        </v-layout>
                    </v-toolbar-title>
                </v-toolbar>
            </template>    
            <v-divider
                class="mx-2"
                inset
                ></v-divider>
                <canvas  id="c" class="canvas-wrapper"></canvas>
           <!-- <ul>
                <li v-for="(img,i) in imgs" :key="i">
                    <img class="image" @click="addImg(img,i)" :src="getImgURL(img,i)" width="50px" height="50px" v-bind:alt="img.src">
                </li>
            </ul> -->
        </v-card>
</template>

<script>
import crudMixin from '../../components/mixins/CRUD.js'
//import jsPDF from "jspdf"
//import html2canvas from "html2canvas"
import {fabric}  from "fabric"
export default {
    mixins: [
      crudMixin
    ],
   data: () => ({
        tobg: false,
        checkbox: true,
        download: '',
        salvarComo: 'baixar em PDF',
        userType: '',
        render: false,//só dps de carregar as imgs!
        canvas: '',
        img: '',
        itens: '',//imgs, futuramente texto..etc,
        imgs: [],
        campanha_id: undefined,
        imgsList: []
    }),
    watch:{
        checkbox(){
            if(this.checkbox === true)
                this.salvarComo = 'baixar em PDF'
            else
                this.salvarComo = 'baixar em BMP'
        },
        tobg(){
            if(this.tobg === true)
                this.setBackground()
        }
    },
    mounted() {
        this.canvas = new fabric.Canvas('c')
        this.canvas.setHeight(1000)
        this.canvas.setWidth(1000)
        this.userType = this.$store.state.auth.userType
        this.checkRedirect()
    },
    methods: {
        submeterAvaliacao(){//envia tabloide/campanha para o diretor
            this.salvarTabloide()
            this.changeCampanhaStatus('em avaliação')
        },
        async changeCampanhaStatus(status){//irá mudar o status da campanha
            await this.updateStatus(this.campanha_id,status)
            this.$router.push('/tabloides')
        },
        voltar(){
            if(this.userType === 'diretor')
                this.$router.push('/analise')
            else
                this.$router.push('/tabloides')
        },
        checkRedirect(){//se tentar acessar essa pag sem existir uma campanha associada, redirecionar
            this.campanha_id = this.$route.params.campanha_id
            if(this.campanha_id === undefined)
                this.$router.push('/tabloides')
            else{
                this.fetchProdutos()//console.log("ID: ", this.campanha_id) 
                this.carregarTabloide()
            }        
        },
        async fetchProdutos(){
            console.log("no fetc ", this.campanha_id)
            this.itens = await this.getProdutos(this.campanha_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            this.itens.forEach(p => {
                if(p.img !== undefined && p.img !== '')
                    this.imgs.push( p.img)
            })
        },
        getImgURL(img){
        //se uma img nao tiver sido escolhida, retorne enm branco
        const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
        return path
        },
        async carregarTabloide(){
            const jsonTabloide = await this.loadTabloide(this.campanha_id)
            this.canvas.loadFromJSON(jsonTabloide.data.tabloide)
            this.canvas.renderAll()
            console.log("carregou ")
        },
        salvarTabloide(){
            var json = JSON.stringify(this.canvas.toJSON())
            this.saveTabloide(json,this.campanha_id)
            console.log("salvo com sucesso.")
        },
        async salvarPdf(checkbox){
            if(checkbox){
                this.canvas.discardActiveObject()//deselect, p n salvar com a markinha das opcoes
                this.canvas.renderAll()
                //FUNDAMENTAL N USAR IMPORT, SE N DÁ O BUG DO WINDOW NOT DEFINED.
                //ESSA SOLUCAO FOI RECOMENDADA EM https://github.com/MrRio/jsPDF/issues/1891
                const jsPDF = require('jspdf')
                const html2canvas = require("html2canvas")
                window.html2canvas = html2canvas
                //FIM DO TRECHO ESSENCIAL
            
                let canvas = await html2canvas(document.getElementById('c'))
                    .then((canvas) => {
                        const imgData = canvas.toDataURL('image/jpeg',1.0)
                        const pdf = new jsPDF("p","mm","tabloid")//new jsPDF({
                        // orientation: 'landscape',
                        // });
                        const imgProps= pdf.getImageProperties(imgData);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                        pdf.addImage(imgData, 'JPEG', -1, 1, pdfWidth, pdfHeight);
                        pdf.save('tabloide.pdf');
                    });
            }
            else
                this.saveAsImg()      
        },
        saveAsImg(){
            var image = this.canvas.toDataURL("image/jpg",1.0)
            alert("vam porra ")
            this.$refs['download'].href = image;
        },
        //METODOS RELATIVOS AO CANVAS/FABRIC
        addImg(img,i){
            //console.log("adicionando img de indice ",i)
            const relaPath = "../../../uploads/fotos/" + img.name
            this.addImgToCanvas(relaPath,img)//parece estranho eu n passar simplesmente img, mas o fabric é eskisito...entao vai assim
        },
         addImgToCanvas(path,img){//fabric salvará essas imgs e poderei as referencias
            fabric.Image.fromURL(path,(img)=>{
                img.scaleToWidth(150)//dif de crop, aqui literalmente "redimensiona"
                img.scaleToHeight(150)
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
                if(!this.tobg)
                    this.canvas.add(temp)
                else
                   this.setBackground(path,img)    
            })//{canvas: this.canvas})//n funciona passar esse arg...doc lixoooo
        },
        setBackground(path,img){
            fabric.Image.fromURL(path,(img)=>{
                img.scaleToWidth(this.canvas.width)//dif de crop, aqui literalmente "redimensiona"
                img.scaleToHeight(this.canvas.height)
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
            
                this.canvas.setBackgroundImage(temp)
                this.canvas.renderAll()
   
            })
        
        },
        removeSelected(){//remove do canvas o(s) objeto(s) que está selecionado
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
//.canvas {
  //  border:1px solid black;	
//}
</script>

<style scoped>

.listaHorizontal{
    float: left;
    padding: 2px
}
.teste{
    background-color: darkgrey;
}
.canvas-wrapper {
    width: 900px;
    min-height: 600px;
    background-color: white;
 }
 .xd{
     background-color: white;
 }
 #c{
     position: absolute;
     top:22px;
     left:0px;
     height: 100%;
     width: 99%;
 }
</style>


