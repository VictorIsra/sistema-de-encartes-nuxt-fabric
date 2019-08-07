<template>
        <div>
        <v-card>
       <!--     <alerts></alerts>-->
   <!--deletar :canvas="canvasInfo"></deletar>-->
            <template v-if="userType === 'tabloide'">
                <v-toolbar  :class="{'borda': canvasMode !== 'portrait',
                                'borda2': canvasMode === 'portrait'}">
                    <v-layout align-center class="justify-center">  
                        
                        <canvas-grid :canvas="canvasInfo" :flag="removeGridFlag" :checkGrid="checkGrid"></canvas-grid> 
                            <v-divider  inset vertical class="mx-2"></v-divider>
                        <copy-paste :canvas="canvasInfo" ></copy-paste>
                            <v-divider class="mx-2" inset vertical></v-divider>
                        <agrupar :canvas="canvasInfo"></agrupar>
                        <deletar :canvas="canvasInfo"></deletar>
                            <v-divider class="mx-2" inset vertical></v-divider>
                        <canvas-move :canvas="canvasInfo"></canvas-move>
                            <v-divider class="mx-2" inset vertical></v-divider>
                   
                        <div>
                        <reset-canvas :canvas=canvas></reset-canvas>
                        </div>
                        <div><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small v-on="on" dark @click="canvas.setZoom(canvas.getZoom() / 1.1 )">
                                <v-icon>remove_circle</v-icon>
                            </v-btn></template>
                            <span class="subheading">Afastar canvas em 1 unidade (Zoon out)</span>
                            </v-tooltip>
                        </div>
                        <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small v-on="on" dark @click="canvas.setZoom(canvas.getZoom() * 1.1 )">
                                <v-icon>add</v-icon>
                            </v-btn></template>
                            <span class="subheading">Aproximar canvas em 1 unidade (Zoon in)</span>
                            </v-tooltip>
                        </div>  <v-divider
                                class="mx-2"
                                
                                vertical
                            ></v-divider>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                        <v-btn color="primary" fab small v-on="on" @click="actionHandler('bring',false)"> <v-icon size=30>arrow_upward</v-icon></v-btn>
                        </template>
                        <span class="subheading">Jogar elemento(s) para frente do canvas</span></v-tooltip> <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                        <v-btn color="primary" v-on="on" fab small @click="actionHandler('bring',true)"><v-icon size=30>arrow_downward</v-icon></v-btn> </template>
                        <span class="subheading">Jogar elemento(s) para o fundo do canvas</span> </v-tooltip>
                        <v-divider
                                class="mx-2"
                                
                                vertical
                            ></v-divider>
                        <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small v-on="on" dark @click="lever = !lever">
                                <v-icon size=30>build</v-icon>
                            </v-btn></template>
                            <span class="subheading">Painel de opções</span>
                            </v-tooltip>
                        </div> <div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small v-on="on" dark @click="lever2 = !lever2">
                                <v-icon size=30>title</v-icon>
                            </v-btn></template>
                            <span class="subheading">Painel de formatação de texto</span>
                            </v-tooltip>
                        </div><div>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" @click="lever3 = !lever3" fab small v-on="on" dark>
                                <v-icon size=30>image</v-icon>
                            </v-btn></template>
                            <span class="subheading">Mostrar lista de imagens</span>
                            </v-tooltip>
                        </div>
                    
                    </v-layout>
                </v-toolbar>
                 <v-toolbar v-show="lever" flat :class="{'borda': canvasMode !== 'portrait',
                                'borda2': canvasMode === 'portrait'}">
                    <v-layout align-center class="justify-center">
                        
                        <v-toolbar-title>
                            <div>
                              
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn color="primary" fab medium dark @click="voltar" v-on="on"> 
                                        <v-icon>arrow_back</v-icon>
                                    </v-btn>
                                </template>
                                <span class="subheading">Voltar para painel inicial</span>
                                </v-tooltip>
                            </div> 
                        </v-toolbar-title>
                            <div>
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                <v-btn v-on="on" color="primary" fab medium dark @click="submeterAvaliacao">
                                    <v-icon>gavel</v-icon>
                                </v-btn>
                                </template>
                                <span class="subheading">Submeter este tablóide para avaliação</span>
                                </v-tooltip>
                            </div> 
                     
                            <div>
                                <canvas-option  :campanha_id="campanha_id" :canvas=canvas @canvasmode="setMode" @getReal="fillInfo" @resize-canvas="setCanvasDim"></canvas-option>
                            </div>
                            <div @click="loading = true">
                            <save-canvas :canvas="canvasInfo" ></save-canvas>
                            </div>
                            <div @mouseover="removeGrid" @click="loading = true">
                                <save-pdf :canvas="canvasInfo"></save-pdf>
                            </div >
                        </v-layout>    
                </v-toolbar>
                    <v-toolbar v-show="lever2 === true" dense :class="{'borda': canvasMode !== 'portrait',
                                'borda2': canvasMode === 'portrait'}"> 
                    
                        <template v-if="$vuetify.breakpoint.mdAndUp">
                        <font-manager :flag=evflag :canvas=canvas  :colors=colors></font-manager>
                        <v-divider vertical class="mx-2"></v-divider>
                         <text-styles :canvas="canvas" @tstyles="listenFontStyle" :toggle="toggle_exclusive"></text-styles>
                        <supers :canvas="canvas"></supers>
                        <text-box :canvas=canvas></text-box>

                        <v-divider  class="mx-1" vertical></v-divider>
                        <escala :canvas=canvas :flag=evflag></escala>
                        </template>
                    </v-toolbar>
               
                <v-toolbar v-show="lever3" :class="{'borda': canvasMode !== 'portrait',
                                'borda2': canvasMode === 'portrait'}">
                <no-ssr>
                    <v-flex>
                    <listsx v-show="filtroEscolhido === 'produtos'" :campanha_id="campanha_id" :canvas="canvas"></listsx>
                    </v-flex>
                     <v-list v-show="filtroEscolhido === 'backgrounds'" class="scroll-y">
                        <bg-lista  :canvas=canvas :currBg=currBg :flag=bgFlag></bg-lista>
                    </v-list>
                      <v-list v-show="filtroEscolhido === 'complementares'" class="scroll-y">
                       <comple-list :canvas=canvas></comple-list>
                    </v-list>
                </no-ssr> 
                                            <v-divider vertical class="mx-1"></v-divider>

                <add-polygon v-if="filtroEscolhido === 'complementares'" :canvas="canvas" :colors=colors></add-polygon>

                <v-divider vertical class="mx-1"></v-divider>
                        <template>
                            <v-flex xs1>
                            <span class="heading indigo--text">Filtrar por</span>
                            </v-flex>
                            <v-flex xs2>
                            <v-select
                                :items="filtro"
                                v-model="filtroEscolhido"
                            ></v-select>
                            </v-flex>
                        </template>    
            </v-toolbar>      
            </template>
            <template v-else>
                <v-toolbar flat color="grey lighten-4">
                    <v-layout align-center class="justify-center">
                        <v-toolbar-title>
                            <div>
                                <v-btn color="primary" fab medium dark @click="voltar">
                                    <v-icon>arrow_back</v-icon>
                                </v-btn>
                            </div> 
                        </v-toolbar-title>
                    </v-layout>
                </v-toolbar>
            </template>  
        </v-card>
            <v-layout row >
                    <v-layout >
                        <v-flex>
                        <no-ssr sx1>
                        <template>  
                        <chrome-picker class="borda2" v-model="colors">
                            </chrome-picker>
                        </template>  
                        
                        </no-ssr>
                        </v-flex> 
                        <v-flex sx1> 
                        <span v-if="isDragging" @wheel="wheelOn"  @click="changeTest" @mouseup="mouseUp" @mousedown="mouseDown" @mousemove.stop="mouseMove">
                            <canvas  id="c"     ></canvas>
                        </span>
                        <span  v-else @wheel="wheelOn"  @click="changeTest" @mouseup="mouseUp" @mousedown="mouseDown" @mousemove="mouseMove">
                            <canvas  id="c"   ></canvas>
                            </span>
                        </v-flex>
                    </v-layout>
                </v-layout>
        </div>
</template>

<script>
import crudMixin from '../../components/mixins/CRUD.js'
import {fabric}  from "fabric"
import {textStyles,supers,bgList,resetCanvas,escala,fontManager,Compact,Chrome,canvasOption,saveCanvas,saveCavasPDF,canvasMove,canvasGrid,copiarColar,agrupar,deletar,alerts,addpolygon,listsx,compleList,textBox} from '../../plugins/canvasImports.js'
export default {
    mixins: [
      crudMixin
    ],
    components:{
         'reset-canvas':resetCanvas,
        escala,
        'bg-lista':bgList,
        'font-manager': fontManager,
        'compact-picker': Compact,
        'chrome-picker':Chrome,
        'canvas-option':canvasOption,
        'save-canvas': saveCanvas,
        'save-pdf': saveCavasPDF,
        'canvas-move': canvasMove,
        'canvas-grid': canvasGrid,
        'copy-paste': copiarColar,
        agrupar,
        deletar,
        alerts,
        supers,
        listsx,
        'comple-list':compleList,
        'addPolygon': addpolygon,
        'text-styles':textStyles,
        textBox
    },
   data: () => ({
    
        toggle_exclusive: 3,
        toggle_grid_exclusive: '',//util,toggle de outro agrupament oe botao
        filtro: [{ text: 'produtos'},
                {text: 'backgrounds'},
                {text: 'complementares'}
        ],
        filtroEscolhido: 'produtos',
        gridGroup: null,
        checkGrid: undefined,//checkbox q diz erespeito ao grid
        isDragging: false,
        lastPosX: 0,
        lastPosY: 0,
        altura:0,
        largura:0,
        folha: 'A4',
       colors: '#194d33',//var obrigatoria na lib de color picker
      salvarComo: 'baixar em PDF',
        tobg: false,
        checkbox: true,
        userType: '',
        canvas: '',
        canvasMode: 'portrait',//portrait ou landscape,
        campanha_id: undefined,
        loading: false,
        currBg: '',//background q ta sendo usado no momento, usado caso a res do canvas mude 
        clipboard: '',
        dpi: 300,
        canvasInfo: {},//fundamental, será uma prop p diversos componentes!
       removeGridFlag: 0,
       bgFlag: 0,
       lever: true,//lever1 e 2 controlam layout de opcoes e de edicao de texto respectivamente
       lever2: false,
       lever3: false,
       evflag: 0,//serve p ver qd cliquei num texto e assim alterar o tomanho da font
       zout: true

    }),
    computed:{
        checkPrevent(){
            if(this.isDragging){
                return {click: 'e'}
            }
        }
    },
    watch:{
        canvasMode(){
            this.checkGrid = false
            this.removeGrid()
        },
        canvasInfo:{
            handler(){
                this.canvasInfo.folha = this.folha
                console.log("dddd",this.canvasInfo.folha)
            },deep:true
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
      
        this.userType = this.$store.state.auth.userType
        this.checkRedirect()
    },
    methods: {  
       
        setMode(objeto){
            if(objeto.data.mode === 'portrait')//troca p mduar e executar o watch
                this.canvasMode = 'landscape'
            this.removeGrid()
            this.checkGrid = undefined
            this.canvasMode = objeto.data.mode

        
        },
        listenFontStyle(toggle){
            this.toggle_exclusive = toggle
        },
        copy(){
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                this.canvas.getActiveObject().clone(cloned => {
                    this.clipboard = cloned
                })
              
                console.log("clip ",this.clipboard)
            }
        },
        paste(){
            if(this.clipboard === '' || (this.clipboard === undefined))
                return
            this.clipboard.clone(clonedObj => {
            this.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = this.canvas;
                clonedObj.forEachObject(obj => {
                    this.canvas.add(obj)
                })
                // this should solve the unselectability
                clonedObj.setCoords();
            } else {
                this.canvas.add(clonedObj);
            }
           this.clipboard.top += 10;
           this.clipboard.left += 10;
            this.canvas.setActiveObject(clonedObj);
            this.canvas.requestRenderAll();
        });
        },
        fillInfo(data){
            this.altura = data.altura
            this.largura = data.largura
            this.folha = data.folha
            this.dpi = data.dpi
        },
        setCanvasDim(objeto){
            if(objeto.data === undefined)
                return
                console.log("q emite ", objeto , " objto data ", objeto.data)  
            this.canvas.setHeight(objeto.data.width)
            this.canvas.setWidth(objeto.data.height)
            this.folha = objeto.data.folha
            this.canvasInfo.folha = this.folha
            console.log(" this,folha ", this.folha , " objeto ",objeto.data)
            let auxwidth = this.canvas.width
            this.bgFlag = !this.bgFlag   

                if(this.zout){//essencial p n dar zoomout qd eu reseto o status no componente
                    this.canvas.setZoom(this.canvas.getZoom() / (auxwidth /175) )
                    var delta = new fabric.Point(400,0)
                    this.canvas.relativePan(delta)
                    var delta = new fabric.Point(0,20)
                    this.canvas.relativePan(delta)
                }
                this.zout = false    
        },
        removeGrid(){
            this.removeGridFlag = !this.removeGridFlag
            this.gridGroup && this.canvas.remove(this.gridGroup)
            this.gridGroup = null
            this.checkGrid = undefined

        },
        mouseDown(evento){
            if (evento.ctrlKey === true) {
                this.isDragging = true
                this.lastPosX = evento.clientX
                this.lastPosY = evento.clientY
              
                console.log("exito:??? ", evento,evento.defaultPrevented )
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
        //event indicará a acao q deve ser feita, e o value o valor passado
        actionHandler(event, value = false){//como as f de mudar cor, tamanho do texto, font etc tem a msm estrutura, essa funcao fará o papel de todos os casos
           if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                let doomedObj = this.canvas.getActiveObject();
                if (doomedObj.type === 'activeSelection') {
                    //varios object selecinados
                    doomedObj.canvas = this.canvas

                    if(event === 'fontColor'){
                        doomedObj.forEachObject((obj) => {
                             obj.setColor(this.colors.hex8)
                        })
                    }
                  
                    else if(event === 'bring'){
                        doomedObj.forEachObject((obj) => {
                            if(!value){
                                this.canvas.bringToFront(obj)
                                if(this.gridGroup)
                                    this.canvas.bringToFront(this.gridGroup)//grid ficar sempre atras, caso ele exista
                            }    
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
                    if(activeObject !== null ) {''
                         if(event === 'fontColor'){
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
                            if(!value){
                                this.canvas.bringToFront(activeObject)
                                if(this.gridGroup)
                                    this.canvas.bringToFront(this.gridGroup)//grid ficar sempre atras, caso ele exista
                            }    
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
                this.toggle_exclusive = 3     
        },
        changeTest(event){
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                if(this.canvas.getActiveObject().text !== undefined){//exclusivo p texto
                    this.checkFontStyle(this.canvas.getActiveObject().fontStyle)
                }
                this.evflag = !this.evflag
            }
            else
                console.log("Nada selec")    
        },
        agrupa(){
            //agrupa selecoes
            if (!this.canvas.getActiveObject()) {
                return
            }
            if (this.canvas.getActiveObject().type !== 'activeSelection') {
                return
                }
            this.canvas.getActiveObject().toGroup();
            this.canvas.requestRenderAll();
        },
        desagrupa(){
            if (!this.canvas.getActiveObject()) {
                return
            }
            if (this.canvas.getActiveObject().type !== 'group') {
                return
            }
            this.canvas.getActiveObject().toActiveSelection();
            this.canvas.requestRenderAll();
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
            //this.salvarTabloide() DEVERIA DEIXARP OR HR
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
                this.canvasInfo = {
                    ref: this.canvas,
                    campanha_id: this.campanha_id,
                    flag: this.currBg !== '' ? this.currBg : undefined,
                    folha: this.folha
                }
                this.carregarTabloide()
            }        
        },  
        updateCanvasInfo(){
            this.canvasInfo = {
                    ref: this.canvas,
                    campanha_id: this.campanha_id,
                    flag: this.currBg !== '' ? this.currBg : undefined,
                    folha: this.folha
            }
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
            this.folha = jsonTabloide.data.tabloide_folha
            this.canvas.renderAll()
            if(this.userType!== 'tabloide'){
               // alert("ideia boa mas temq usa bd agora xd" + this.altura + " l " + this.largura)
                this.canvas.setHeight(2000)
                this.canvas.setWidth(2500)            
            }
            this.evflag = !this.evflag
            this.lever = false
        },
       addComple(img){
            const relaPath = "../../../uploads/fotos/" + img.name
            this.addImgToCanvas(relaPath,img)//parece e
       },
        addImgToCanvas(path,img){//fabric salvará essas imgs e poderei as referencias
            fabric.Image.fromURL(path,(img)=>{
                img.scaleToWidth(350)//dif de crop, aqui literalmente "redimensiona"
                img.scaleToHeight(350)
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
               // if(!this.tobg){
                this.canvas.add(temp)
                if(this.gridGroup)
                    this.canvas.bringToFront(this.gridGroup)//grid ficar sempre atras, caso ele exista
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
<style scoped >
.listaHorizontal{
    float: left;
    padding: 2px
}
.teste{
    background-color: darkgray
}

 .borda{
    border: 4px ridge #1976D2;
    width: 103%;
 }
 .borda2{
    border: 4px ridge #1976D2;
    width: 100;
 }
 .xd{
     background-color: white;
 }
 #c{
    color: red;

 }  
 .tolbar{
     position: relative;
  color:aqua;
  width: 100%;
  will-change: padding-left;
  
 }
 .largura{
     padding: 5px;
     width: 10px;
 }
 .gg2{
     width: 1000px;
     height:  200px;
 }
 .xd7{
  top: 20px; left: 20px;
      z-index: 2;
      color:black }
</style>