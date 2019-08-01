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
                            <v-btn round color="warning" @click="actionHandler('removeSelection')">remover seleção</v-btn>
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
                    <v-layout align-center class="justify-center">
                         <span>Mostrar grid:</span>
                            <v-checkbox class="justify-space-between"
                                v-model="checkGrid"
                            ></v-checkbox> 
                         <div>
                            <v-btn color="primary" fab small dark @click="setCanvasDim(3600,2300,'landscape')">
                                <v-icon>stay_current_landscape</v-icon>
                            </v-btn>
                        </div> 
                         <div>
                            <v-btn color="primary" fab small dark @click="setCanvasDim(1640,1000,'portrait')">
                                <v-icon>stay_current_portrait</v-icon>
                            </v-btn>
                        </div> 
                        <div>
                            <v-btn color="primary" fab small dark @click="Xmovement(-1)">
                                <v-icon>arrow_back</v-icon>
                            </v-btn>
                        </div>
                        <div>
                            <v-btn color="primary" fab small dark @click="Xmovement">
                                <v-icon>arrow_forward</v-icon>
                            </v-btn>
                        </div>
                        <div>
                            <v-btn color="primary" fab small dark @click="Ymovement(-1)">
                                <v-icon>arrow_upward</v-icon>
                            </v-btn>
                        </div>
                        <div>
                            <v-btn color="primary" fab small dark @click="Ymovement">
                                <v-icon>arrow_downward</v-icon>
                            </v-btn>
                        </div>
                        <v-divider
                                class="mx-2"
                                inset
                                vertical
                            ></v-divider>
                        <div>
                            <v-btn color="primary" fab small dark @click="restoreDefault">
                                <v-icon>restore</v-icon>
                            </v-btn>
                        </div>
                        <div>
                            <v-btn color="primary" fab small dark @click="canvas.setZoom(canvas.getZoom() / 1.1 )">
                                <v-icon>remove_circle</v-icon>
                            </v-btn>
                        </div>
                        <div>
                            <v-btn color="primary" fab small dark @click=" canvas.setZoom(canvas.getZoom() * 1.1 )">
                                <v-icon>add</v-icon>
                            </v-btn>
                        </div>
                        <v-divider
                                class="mx-2"
                                inset
                                vertical
                            ></v-divider>
                        <v-btn color="primary" @click="actionHandler('bring',false)">FRENTE</v-btn>
                        <v-btn color="primary"  @click="actionHandler('bring',true)">TRÁS</v-btn>
                    </v-layout>
                </v-toolbar>
                    <v-toolbar dense class="borda"> 
                        <v-flex xs3>
                            <v-overflow-btn
                            label="FONTE"
                            hide-details
                            class="pa-0"
                            v-model="selectionFont"
                            :items='fonts'
                            dense
                            ></v-overflow-btn>
                        </v-flex>
                        <template v-if="$vuetify.breakpoint.mdAndUp">
                        <v-divider vertical></v-divider>

                         <v-flex xs3>
                        <v-overflow-btn
                            :items="dropdown_edit"
                            editable
                            v-model="fontSize"
                            label="Tamanho da fonte"
                            hide-details
                            class="pa-0"
                            overflow
                        ></v-overflow-btn>
                         </v-flex>
                        <v-divider vertical class="mx-2"></v-divider>

                        <v-btn-toggle v-model="toggle_exclusive">
                            <v-btn :value="1" text>
                            <v-icon>format_bold</v-icon>
                            </v-btn>

                            <v-btn :value="2" text>
                            <v-icon>format_italic</v-icon>
                            </v-btn>

                           <!-- <v-btn :value="3" text>
                            <v-icon>format_underlined</v-icon>
                            </v-btn> -->
                        </v-btn-toggle>
                        <v-divider class="mx-2" vertical></v-divider>
                        <v-spacer></v-spacer>
                        <span class="subheading indigo--text">Escala X:</span>
                        <v-flex xs1>
                            <v-divider vertical></v-divider>
                            <span class="subheading indigo--text"> {{elScale.x.toFixed(3)}}</span>
                        </v-flex>
                        <span class="subheading indigo--text">Escala Y:</span>
                        <v-flex xs1>
                            <v-divider vertical></v-divider>
                            <span class="subheading indigo--text ">{{elScale.y.toFixed(3)}}</span>
                        </v-flex>
                        </template>
                    </v-toolbar>
               
                <v-toolbar class="borda">
                <no-ssr>
                    
                    <v-list v-if="filtroEscolhido === 'produtos'" class="scroll-y">
                        <vue-select-image :useLabel="true" :dataImages="dataImages" h='30px' w='30px' @onselectimage="addImg">
                        </vue-select-image>
                    </v-list>
                     <v-list v-if="filtroEscolhido === 'backgrounds'" class="scroll-y">
                        <vue-select-image :useLabel="true" :dataImages="bgsImages" h='30px' w='30px' @onselectimage="addBg">
                        </vue-select-image>
                    </v-list>
                    
                    <v-layout align-center>
                    <v-divider vertical class="mx-2"></v-divider>
                    <v-spacer></v-spacer>
                    <template>
                        <v-flex xs2>
                        <span class="heading indigo--text">Filtrar por</span>
                        </v-flex>
                        <v-flex xs3>
                        <v-select
                            :items="filtro"
                            v-model="filtroEscolhido"
                        ></v-select>
                        </v-flex>
                    </template>    
  </v-layout>

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
                  <no-ssr>
                    <template>  
                    <chrome-picker class="borda gg2" v-model="colors">
                        </chrome-picker>
                    </template>  
                      
                    </no-ssr>
                    <v-flex sx2> 
                        <span @wheel="wheelOn" @click="changeTest" @mouseup="mouseUp" @mousedown="mouseDown" @mousemove="mouseMove"><!-- @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" -->            
                         <canvas  id="c" class="canvas-wrapper"></canvas>
                        </span>
                    </v-flex>
                </v-layout>
        </v-card>
</template>

<script>

import crudMixin from '../../components/mixins/CRUD.js'
import { Compact, Chrome} from 'vue-color'
import {fabric}  from "fabric"
 
export default {
    mixins: [
      crudMixin
    ],
    components:{
        'compact-picker': Compact,
        'chrome-picker':Chrome
    },
   data: () => ({
        dropdown_edit: [
            { text: '10' },
            { text: '20' },
            { text: '30' },
            { text: '40' },
            { text: '50' },
            { text: '60' },
            { text: '70' },
            { text: '80' },
            { text: '90' },
            { text: '100' },
        ],
        toggle_exclusive: '',
       elScale: {//serve pra ver a escala do elemento selecionado, "seu tamanho"
           x: 1,
           y: 1
       },
        filtro: [{ text: 'produtos'},
                {text: 'backgrounds'},
                {text: 'complementares'}
        ],
        filtroEscolhido: 'produtos',
        gridGroup: null,
        checkGrid: false,//checkbox q diz erespeito ao grid
        isDragging: false,
        lastPosX: 0,
        lastPosY: 0,
       colors: '#194d33',//var obrigatoria na lib de color picker
       selectionFont: 'PT Serif',//font inicial de um texto
        fontSize: 20,
        fonts: [ 'PT Serif','Times New Roman',"Roboto", 'Literata' , 'Oswald', "Inconsolata",'Josefin Sans','Indie Flower','Amiri','Rokkitt'],
        textbox:'',
        tobg: false,
        checkbox: true,
        salvarComo: 'baixar em PDF',
        userType: '',
        canvas: '',
        canvasMode: 'portrait',//portrait ou landscape,
        img: '',
        itens: '',//imgs, futuramente texto..etc,
        imgs: [],//produtos
        bgs:[],//bgs
        comple:[],//img complementares
        bgsImages:[],//vetor q contera bgs
        compleImages: [],
        dataImages: [],
        campanha_id: undefined,
        currBg: ''//background q ta sendo usado no momento, usado caso a res do canvas mude 
       // imgsList: []
    }),
    watch:{
        canvasMode(){
            this.checkGrid = false
            this.removeGrid()
        }
        ,
        filtroEscolhido(){
            if(this.filtroEscolhido === 'backgrounds')
                this.tobg = true
        },
       checkGrid(){
            if(this.checkGrid)
                this.fillGrid()
            else
                this.removeGrid()    
        },
        colors(){
            this.actionHandler('fontColor')
        },
        selectionFont(){
            this.actionHandler('fontFamily')
        },
        fontSize(){
            this.actionHandler('fontSize')
        },
        toggle_exclusive(){
            this.actionHandler('fontStyle', this.toggle_exclusive)
        },
        checkbox(){
            if(this.checkbox === true)
                this.salvarComo = 'baixar em PDF'
            else
                this.salvarComo = 'baixar em BMP'
        },
    },
    mounted() { 
        this.canvas = new fabric.Canvas('c',{
        preserveObjectStacking: true})
        this.canvas.setHeight(1540)
        this.canvas.setWidth(1000)
        this.userType = this.$store.state.auth.userType
        this.checkRedirect()

    },
    methods: {  
        setCanvasDim(width,height,mode){
            this.canvasMode = mode
            this.canvas.setHeight(width)
            this.canvas.setWidth(height)
            this.restoreDefault()//apos mudar as dim, da um refesh no canvas p ele voltar pro status original, porem com a res mudada
            if(this.currBg !== ''){
                this.addBg(this.currBg)
            }
        },
        fillGrid(){
            if(this.gridGroup)
                return
            var gridoption = {
                stroke: '#ebebeb',
                strokeWidth: 1,
                distance: 5
            }
            var gridLines = [];
            let gridlen = this.canvas.width > this.canvas.height ?  this.canvas.width :  this.canvas.height
            for (var x = 1; x < (gridlen ); x += 30) {
                gridLines.push(new fabric.Line([x, 0, x, gridlen], gridoption));
          //  }
            //for (var x = 1; x < (this.canvas.height ); x += 30) {
                gridLines.push(new fabric.Line([0, x, gridlen, x], gridoption));
            }
            this.gridGroup = new fabric.Group(gridLines, {
                selectable: false,
                evented: false
            })
            this.gridGroup.addWithUpdate()
            this.canvas.add(this.gridGroup)  
            this.canvas.sendToBack(this.gridGroup)

        },
        removeGrid(){
            this.gridGroup && this.canvas.remove(this.gridGroup)
            this.gridGroup = null
        },
        mouseDown(evento){
            if (evento.ctrlKey === true) {
                this.isDragging = true
                this.lastPosX = evento.clientX
                this.lastPosY = evento.clientY
            }
        },
        mouseMove(evento){
            if(this.isDragging) {
                let deltaX = 0
                let deltaY = 0
                deltaX += evento.clientX - this.lastPosX
                deltaY += evento.clientY - this.lastPosY
                let offset = new fabric.Point(deltaX,deltaY)
                this.canvas.relativePan(offset)
                //this.requestRenderAll();
                this.lastPosX = evento.clientX
                this.lastPosY = evento.clientY
            }
        },
        mouseUp(){
            this.isDragging = false
        },
        Xmovement(flag = 0){//andar p direita ou esuqer
            var units = 10//caso direita
            if(flag === -1)//caso esquerda
                units = -units
            var delta = new fabric.Point(units,0)
            this.canvas.relativePan(delta)
        },
        Ymovement(flag = 0){//andar p cima ou p baixo
            var units = 10//caso p baixo
            if(flag === -1)//caso cima
                units = -units
            var delta = new fabric.Point(0,units)
            this.canvas.relativePan(delta)
        },
         restoreDefault(){
            this.canvas.setZoom(1)
            //reset o canvas para o status inicial
            this.canvas.setViewportTransform([1,0,0,1,0,0]) 
            this.canvas.renderAll()
       },
        //event indicará a acao q deve ser feita, e o value o valor passado
        actionHandler(event, value = false){//como as f de mudar cor, tamanho do texto, font etc tem a msm estrutura, essa funcao fará o papel de todos os casos
           if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                let doomedObj = this.canvas.getActiveObject();
                if (doomedObj.type === 'activeSelection') {
                    //varios object selecinados
                    doomedObj.canvas = this.canvas
                    if(event === 'fontFamily'){
                        doomedObj.forEachObject((obj) => {
                            obj.set("fontFamily", this.selectionFont)
                        })
                    }
                    else if(event === 'fontSize'){
                        doomedObj.forEachObject((obj) => {
                            obj.set("fontSize", this.fontSize.toString())
                        })
                    }
                    else if(event === 'fontColor'){
                        doomedObj.forEachObject((obj) => {
                             obj.setColor(this.colors.hex8)
                        })
                    }
                    else if(event === 'fontStyle'){
                        let style = 'normal'
                        if(value === 1)
                            style = 'Bold'
                        else if(value === 2)
                            style = 'Italic'    
                        doomedObj.forEachObject((obj) => {
                            obj.set("fontStyle", style)
                        })
                    }
                    else if(event === 'bring'){
                        doomedObj.forEachObject((obj) => {
                            if(!value)
                                this.canvas.bringToFront(obj)
                            else
                                this.canvas.sendToBack(obj)
                        })
                    }
                    else if(event === 'removeSelection'){
                        doomedObj.forEachObject((obj) => {
                            this.canvas.remove(obj)
                        })
                    }
                    this.canvas.renderAll()
                }
                else{
                //um unico objeto selecionado
                    var activeObject = this.canvas.getActiveObject();
                    if(activeObject !== null ) {
                        if(event === 'fontFamily'){
                            this.canvas.getActiveObject().set("fontFamily", this.selectionFont)
                        }
                        else if(event === 'fontSize'){
                            this.canvas.getActiveObject().set("fontSize", this.fontSize.toString())
                        }
                        else if(event === 'fontColor'){
                            this.canvas.getActiveObject().setColor(this.colors.hex8)
                        }
                        else if(event === 'fontStyle'){
                            let style = 'normal'
                            if(value === 1)
                                style = 'Bold'
                            else if(value === 2)
                                style = 'Italic'  
                            this.canvas.getActiveObject().set("fontStyle", style)
                        }
                        else if(event === 'bring'){
                            if(!value)
                                this.canvas.bringToFront(activeObject)
                            else
                                this.canvas.sendToBack(activeObject)
                        }
                        else if(event === 'removeSelection'){
                            this.canvas.remove(activeObject);
                        }
                        this.canvas.renderAll()
                    }
                }
                        
            } 
        },
        checkFontStyle(style){//checa o tipo de estilo de fonte selecionada ou nao no painel e retorna
            if(style === 'Bold'){
                this.toggle_exclusive = 1
            }    
            else if(style === 'Italic')
                this.toggle_exclusive = 2
            else if( style === 'normal')
                this.toggle_exclusive = '' 
                
        },
        changeTest(event){
            // console.log(obj.text, obj.fontFamily, obj.fontSize, obj.fontStyle)
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                //comum a todos os el: img, texto etc
                this.elScale.x = this.canvas.getActiveObject().scaleX
                this.elScale.y = this.canvas.getActiveObject().scaleY
                if(this.canvas.getActiveObject().text !== undefined){//exclusivo p texto
                    this.selectionFont = this.canvas.getActiveObject().fontFamily //só textos passam desse teste, imgs sao object active, mas retornam undefined para esse atributo
                    this.fontSize = this.canvas.getActiveObject().fontSize.toString()
                    this.checkFontStyle(this.canvas.getActiveObject().fontStyle)
                }
            }
            else
                console.log("Nada selec")    
        },
        wheelOn(event){
            event.returnValue = false
            if(event.deltaY > 0){//zoom out
                this.canvas.setZoom(this.canvas.getZoom() / 1.1) 
                
            }    
            if(event.deltaY < 0)//zoom in ( aumenta)
                this.canvas.setZoom(this.canvas.getZoom() * 1.1) 
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
            let campanhaBg_id = "5d4223b924a1f1483c193259"
            this.itens = await this.getProdutos(campanhaBg_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            this.itens.forEach(p => {
                if(p.img !== undefined && p.img !== '')
                    this.bgs.push( p.img)  
            })
            this.bgs.forEach((img,i) => {
                this.bgsImages.push(img)
                this.bgsImages[i].src = this.getImgURL(img)

            })
            // let campanhaComple_id = ""
            // this.itens = await this.getProdutos(this.campanha_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            // this.itens.forEach(p => {
            //     if(p.img !== undefined && p.img !== ''){
            //         p.img.alt = p.nome
            //         this.comple.push( p.img)
            //     }    
            // })
            // this.comple.forEach((img,i) => {
            //     this.compleImages.push(img)
            //     this.compleImages[i].src = this.getImgURL(img)

            // })
            this.dataImages.sort(function(a, b){//sortei produtos em ordem alfabetica
                if(a.alt.toLowerCase() < b.alt.toLowerCase()) { return -1; }
                if(a.alt.toLowerCase() > b.alt.toLowerCase()) { return 1; }
                return 0;
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
            this.currBg = jsonTabloide.data.tabloide_bg
            this.canvas.renderAll()
            this.setCanvasDim(3600,2300,'landscape')

        },
        async salvarTabloide(){
            this.checkGrid = false
            await this.removeGrid()
            var json = JSON.stringify(this.canvas.toJSON())
            if(this.currBg !== '')
                this.saveTabloide(json,this.campanha_id,this.currBg)
            else
                this.saveTabloide(json,this.campanha_id)
            console.log("salvo com sucesso.")
        },
        async salvarPdf(checkbox){
            if(checkbox){
                this.canvas.discardActiveObject()//deselect, p n salvar com a markinha das opcoes
                this.restoreDefault()//restaura td pra posicao inicial ( tira zoom e panning)
                this.checkGrid = false//desabilita o grid
                await this.removeGrid()
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
        },
        //METODOS RELATIVOS AO CANVAS/FABRIC
        addImg(img,i){
            console.log("adicionando img de indice ",img)
            const relaPath = "../../../uploads/fotos/" + img.name
            const text = new fabric.IText(img.alt,{ top: 100,fontSize: 40 });
            this.canvas.add(text)
            const preco = new fabric.IText(img.preco_v,{ top: 140,fontSize: 30 });
            this.canvas.add(preco)
            this.addImgToCanvas(relaPath,img)//parece estranho eu n passar simplesmente img, mas o fabric é eskisito...entao vai assim
            //    canvas.sendToBack(relaPath,img);

       },
       addBg(img,i){
           console.log("vejaa IMGa ", img)
            const relaPath = "../../../uploads/fotos/" + img.name
            this.setBackground(relaPath,img)
            this.currBg = img
       },
        addImgToCanvas(path,img){//fabric salvará essas imgs e poderei as referencias
            fabric.Image.fromURL(path,(img)=>{
                img.scaleToWidth(100)//dif de crop, aqui literalmente "redimensiona"
                img.scaleToHeight(100)
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
               // if(!this.tobg){
                this.canvas.add(temp)
            
            })//{canvas: canvas})//n funciona passar esse arg...doc lixoooo
        },
        setBackground(path,img){
            
            fabric.Image.fromURL(path,(img)=>{
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
                this.canvas.setBackgroundImage(temp,this.canvas.renderAll.bind(this.canvas), {
                scaleX: this.canvas.width / temp.width,
                scaleY: this.canvas.height /temp.height})
            })
        
        },    
    }
}
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
    color: red;

 }  
 .largura{
     padding: 5px;
     width: 10px;
 }
 .gg2{
     width: 1000px;
     height:  200px;
 }
</style>