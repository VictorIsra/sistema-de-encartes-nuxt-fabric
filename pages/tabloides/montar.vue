<template>
        <v-card class="teste">
            
            <template v-if="userType === 'tabloide'">
                <v-toolbar flat class="borda">
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
                            <v-btn round color="warning" @click="removeSelected">remover seleção</v-btn>
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
                
               
                <v-toolbar class="borda">
                <no-ssr>
                    
                    <v-list class="scroll-y">
                        <vue-select-image :useLabel="true" :dataImages="dataImages" h='30px' w='30px' @onselectimage="addImg">
                        </vue-select-image>
                    </v-list>

                        <v-divider
                            class="mx-2"
                            inset
                            vertical
                        ></v-divider>
                            <div>
                                <v-btn color="primary" fab medium dark @click="clearZoom">
                                    <v-icon>restore</v-icon>
                                </v-btn>
                            </div>
                            <div>
                                <v-btn color="primary" fab medium dark @click="canvas.setZoom(canvas.getZoom() / 1.1 )">
                                    <v-icon>remove_circle</v-icon>
                                </v-btn>
                            </div>
                             <div>
                                <v-btn color="primary" fab medium dark @click=" canvas.setZoom(canvas.getZoom() * 1.1 )">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </div>
                            <v-btn color="primary" @click="bring(false)">FRENTE</v-btn>
                            <v-btn color="primary"  @click="bring(true)">TRÁS</v-btn>
                    <v-flex xs1 class="subheading primary--text">FONTE:</v-flex>
                    <v-flex xs2>
                         <v-select
                            :items="fonts"
                            v-model="selectionFont"
                            
                        ></v-select>
                    </v-flex>
                </no-ssr>       
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
                <v-layout row>
                    
                    <v-flex>
                 <div @wheel="hoverOn"  ><!-- @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" -->
                      >       
                 <canvas  id="c" class="canvas-wrapper">
                </canvas>
                 </div>
                    </v-flex>
                  <no-ssr>
                    <template>  
                    <chrome-picker class="borda" v-model="colors">
                        </chrome-picker>
                    </template>    
                    </no-ssr>
                </v-layout>
                
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
import { Compact, Chrome} from 'vue-color'
import {fabric}  from "fabric"
 
 
   
export default {
    mixins: [
      crudMixin
    ],/*
    c
     new fabric.Textbox('Lorum ipsum dolor sit amet', {
        left: 50,
        top: 50,
        width: 150,
        fontSize: 20
        });*/
    components:{
        'compact-picker': Compact,
        'chrome-picker':Chrome
    },
    
   data: () => ({
       isDragging: false,
       lastPosX: 0,
       lastPosY: 0,
       mY: 0,
       /**hover canvs */
       hover: false,
       colors: '#194d33',//var obrigatoria na lib de color picker
       selectionFont: 'PT Serif',//font inicial de um texto
        opcao: 'IMAGENS',
        radioGroup: '',
        fonts: [ 'PT Serif','Times New Roman',"Roboto", 'Literata' , 'Oswald', "Inconsolata",'Josefin Sans','Indie Flower','Amiri','Rokkitt'],
        textbox:'',
       dataImages: [],
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
        grid: 50,

        campanha_id: undefined,
        imgsList: []
    }),
    watch:{
       
        colors(){
            this.changeTextColor(this.colors.hex8)
        },
        selectionFont(){
            this.changeTextFamily(this.selectionFont)
        },
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
        this.canvas = new fabric.Canvas('c',{
        preserveObjectStacking: true})
        this.canvas.setHeight(1540)
        this.canvas.setWidth(1000)
        this.userType = this.$store.state.auth.userType
        this.checkRedirect()
        this. fillGrid()

    },
    methods: {
        // loadAndUse(font) {
        //   this.changeTextColor(font)
            
        // },
        mouseMove(opt){
        
        
            // moving upward
        if (opt.pageY < this.mY) {
            console.log('From Bottom');
               var units = 10 ;
        var delta = new fabric.Point(0,units) ;
        this.canvas.relativePan(delta) 
        this.canvas.requestRenderAll();
        // moving downward
        } else {
            console.log('From Top');
               var units = 1 ;
        var delta = new fabric.Point(0,-units) ;
        this.canvas.relativePan(delta) 
        this.canvas.requestRenderAll();
        }

        // set new mY after doing test above
        this.mY = opt.pageY;

        //     console.log("ddd ",opt)
        //     if (this.isDragging) {
            
        //          var units = 10 ;
        // var delta = new fabric.Point(0,-units) ;
        // this.canvas.relativePan(delta) 
        // this.canvas.requestRenderAll();
        //     }
            
        },
        mouseDown(opt){
            console.log("mdddd", opt)
            if (opt.ctrlKey === true) {
                this.isDragging = true
               // this.selection = false
               console.log("al tru opt ev: ",opt)
                this.lastPosX = opt.clientX
                this.lastPosY = opt.clientY
            }
        },
         mouseUp(opt){
            console.log("mdddd", opt)
                this.isDragging = false
               // this.selection = false
               console.log("al tru opt ev: ",opt)
                this.lastPosX = opt.clientX
                this.lastPosY = opt.clientY
        },
        hoverOn(event){
            console.log("EVENT ",event)
            event.returnValue = false
            if(event.deltaY > 0){
                this.canvas.setZoom(this.canvas.getZoom() / 1.1) 
                
            }    
            if(event.deltaY < 0)
                this.canvas.setZoom(this.canvas.getZoom() * 1.1) 
        },
        fillGrid(){
          var grid = 50;
            var unitScale = 100;
            // var canvasWidth =  100 * unitScale;
            // var canvasHeight = 100 * unitScale;

            // canvas.setWidth(canvasWidth);
            // canvas.setHeight(canvasHeight);

            // create grid

            for (var i = 0; i < (600 / grid); i++) {
            this.canvas.add(new fabric.Line([ i * grid, 0, i * grid,600], { type:'line', stroke: '#ccc', selectable: false }));
            this.canvas.add(new fabric.Line([ 0, i *600, i * grid], { type: 'line', stroke: '#ccc', selectable: false }))
            }
        },
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
               // this.fetchProdList()
                this.fetchProdutos()//console.log("ID: ", this.campanha_id) 
                this.carregarTabloide()
            }        
        },
        
     
        async fetchProdutos(){
            console.log("no fetc ", this.campanha_id)
            this.itens = await this.getProdutos(this.campanha_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            this.itens.forEach(p => {
                if(p.img !== undefined && p.img !== ''){
                    p.img.alt = p.nome
                    p.img.preco_v = p.preco_v
                    this.imgs.push( p.img)
                }    
            })
            this.imgs.forEach((img,i) => {
                this.dataImages.push(img)
                this.dataImages[i].src = this.getImgURL(img)

            })
        },
        
        getImgURL(img){
        //se uma img nao tiver sido escolhida, retorne enm branco
        console.log("entrou c ",img)
        const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
        return path
        },
        async carregarTabloide(){
            const jsonTabloide = await this.loadTabloide(this.campanha_id)
            this.canvas.loadFromJSON(jsonTabloide.data.tabloide)
            this.canvas.renderAll()

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
            //var image = canvas.toDataURL("image/jpg",1.0)
            //this.$refs['download'].href = image;
        },
        //METODOS RELATIVOS AO CANVAS/FABRIC
        addImg(img,i){
            console.log("adicionando img de indice ",img)
            const relaPath = "../../../uploads/fotos/" + img.name
            const text = new fabric.IText(img.alt,{ top: 100,fontSize: 20 });
            this.canvas.add(text)
            const preco = new fabric.IText(img.preco_v,{ top: 125,fontSize: 20 });
            this.canvas.add(preco)
            this.addImgToCanvas(relaPath,img)//parece estranho eu n passar simplesmente img, mas o fabric é eskisito...entao vai assim
            //    canvas.sendToBack(relaPath,img);

       },
       clearZoom(){
            this.canvas.setZoom(1);
            this.canvas.renderAll()
       },
       
        
         addImgToCanvas(path,img){//fabric salvará essas imgs e poderei as referencias
            fabric.Image.fromURL(path,(img)=>{
                img.scaleToWidth(100)//dif de crop, aqui literalmente "redimensiona"
                img.scaleToHeight(100)
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
                if(!this.tobg){
                    this.canvas.add(temp)
                }    
                else
                   this.setBackground(path,img)    
            })//{canvas: canvas})//n funciona passar esse arg...doc lixoooo
        },


     scaleAndPositionImage(bgImage) {
        //setCanvasZoom();
        //bgImage = fabric.Image.fromURL(bgImage)
        var canvasAspect = this.canvas.width / this.canvas.height//  canvasWidth / canvasHeight;
        var imgAspect = bgImage.width / bgImage.height;
        var left, top, scaleFactor;

        if (canvasAspect >= imgAspect) {
            var scaleFactor = this.canvas.width / bgImage.width;
            left = 0;
            top = -((bgImage.height * scaleFactor) -  this.canvas.height) / 2;
        } else {
            var scaleFactor = this.canvas.height / bgImage.height;
            top = 0;
            left = -((bgImage.width * scaleFactor) - this.canvas.width) / 2;

        }
        this.canvas.setBackgroundImage(bgImage, this.canvas.renderAll.bind(this.canvas), {
            top: top,
            left: left,
            originX: 'left',
            originY: 'top',
            scaleX: scaleFactor,
            scaleY: scaleFactor
        });
        this.canvas.renderAll();

    },
        setBackground(path,img){
            
            fabric.Image.fromURL(path,(img)=>{
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
                this.canvas.setBackgroundImage(temp,this.canvas.renderAll.bind(this.canvas), {
                scaleX: this.canvas.width / temp.width,
                scaleY: this.canvas.height /temp.height})
            })
        
        },
             changeTextFamily(font){
             if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                let doomedObj = this.canvas.getActiveObject();
                if (doomedObj.type === 'activeSelection') {
                    //lembre de arro f pra referenciar o this sem ko
                    doomedObj.canvas = this.canvas
                    doomedObj.forEachObject((obj) => {
                        obj.set("fontFamily", this.selectionFont)
                    });
                    this.canvas.renderAll()

                }
                else{
                //um unico objeto selecionado
                var activeObject = this.canvas.getActiveObject();
                    if(activeObject !== null ) {
                        this.canvas.getActiveObject().set("fontFamily", this.selectionFont)
                        this.canvas.renderAll()
                    }
                }
                        
            } 
        },
        changeTextColor(font){
             if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                let doomedObj = this.canvas.getActiveObject();
                if (doomedObj.type === 'activeSelection') {
                    //lembre de arro f pra referenciar o this sem ko
                    doomedObj.canvas = this.canvas
                    doomedObj.forEachObject((obj) => {
                        obj.setColor(font)
                        this.canvas.renderAll()

                    });
                }
                else{
                //um unico objeto selecionado
                var activeObject = this.canvas.getActiveObject();
                    if(activeObject !== null ) {
                        this.canvas.getActiveObject().setColor(font)
                        this.canvas.renderAll()
                    }
                }
                        
            } 
            
        },
        bring(back = false){//remove do canvas o(s) objeto(s) que está selecionado
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                let doomedObj = this.canvas.getActiveObject();
                if (doomedObj.type === 'activeSelection') {
                    //lembre de arro f pra referenciar o this sem ko
                    doomedObj.canvas = this.canvas
                    doomedObj.forEachObject((obj) => {
                        if(!back)
                            this.canvas.bringToFront(obj)
                        else
                          canvas.sendToBack(obj)
                    });
                }
                else{
                //um unico objeto selecionado
                var activeObject = this.canvas.getActiveObject();
                    if(activeObject !== null ) {
                        if(!back)
                            this.canvas.bringToFront(activeObject)
                        else
                          this.canvas.sendToBack(activeObject)
                    }
                }
                        
            } 
        },
        removeSelected(){//remove do canvas o(s) objeto(s) que está selecionado
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
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
//}// #1976D2
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Bahianita|PT+Serif|Darker+Grotesque|Indie+Flower|Josefin+Sans|Literata|Oswald|Roboto|Amiri|Cinzel|Patua+One|Permanent+Marker|Righteous|Rokkitt|Vollkorn&display=swap');
.listaHorizontal{
    float: left;
    padding: 2px
}

.teste{
    background-color: darkgray
}

.canvas-wrapper {
    width: 900px;
    min-height: 600px;
    background-color: white;
 }
 .borda{
    border: 4px ridge #1976D2;
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
 .largura{
     padding: 5px;
     width: 10px;
 }
</style>


