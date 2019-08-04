<template>
        <div>
        <v-card>
       <!--     <alerts></alerts>-->
          <v-progress-linear v-if="loading"
      indeterminate
      color="cyan"
    ></v-progress-linear><!--deletar :canvas="canvasInfo"></deletar>-->
            <template v-if="userType === 'tabloide'">
               
                <v-toolbar  :class="{'borda': canvasMode !== 'portrait',
                                'borda2': canvasMode === 'portrait'}">
                    <v-layout align-center class="justify-center">
                       
                      <canvas-grid :canvas="canvasInfo" :flag="removeGridFlag" :checkGrid="checkGrid"></canvas-grid> 
                        <v-divider  
                                inset
                                vertical class="mx-2"></v-divider>
                   
                        <copy-paste :canvas="canvasInfo" ></copy-paste>
                        
                          <v-divider class="mx-2"
                                inset
                                vertical>
                                </v-divider>
                          <agrupar :canvas="canvasInfo"></agrupar>
                        <deletar :canvas="canvasInfo"></deletar>
                         <v-divider class="mx-2"
                                inset
                                vertical>
                                </v-divider>
                        <canvas-move :canvas="canvasInfo"></canvas-move>
                        <v-divider
                                class="mx-2"
                                inset
                                vertical
                            ></v-divider>
                        <div><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn color="primary" fab small dark v-on="on" @click="restoreDefault">
                                <v-icon>restore</v-icon>
                            </v-btn>    
                            </template>
                            <span class="subheading">Setar canvas para posição e zoon originais</span>
                            </v-tooltip>
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
                        <v-divider
                                class="mx-2"
                                inset
                                vertical
                            ></v-divider> 
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
                                <canvas-option @canvasmode="setMode" @getReal="fillInfo" @resize-canvas="setCanvasDim"></canvas-option>
                            </div>
                            <save-canvas :canvas="canvasInfo" ></save-canvas>
                            <div @mouseover="removeGrid">
                                <save-pdf :canvas="canvasInfo"></save-pdf>
                            </div >
                        </v-layout>    
                </v-toolbar>
                    <v-toolbar v-show="lever2 === true" dense :class="{'borda': canvasMode !== 'portrait',
                                'borda2': canvasMode === 'portrait'}"> 
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

                        <v-btn-toggle v-model="toggle_exclusive" mandatory>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                             <v-btn :value="3" v-on="on" text @click="checkFontStyle('normal')">
                            <v-icon>text_fields</v-icon>
                            </v-btn> </template>
                            <span class="subheading">Aplicar estilo padrão ao(s) texto(s) selecionado(s)</span>
                            </v-tooltip><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn :value="1" text @click="checkFontStyle('Bold')" v-on="on">
                            <v-icon>format_bold</v-icon>
                            </v-btn> </template>
                            <span class="subheading" >Aplicar estilo negrito ao(s) texto(s) selecionado(s)</span>
                            </v-tooltip><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn :value="2" v-on="on" text @click="checkFontStyle('Italic')">
                            <v-icon>format_italic</v-icon>
                           </v-btn></template>
                            <span class="subheading">Aplicar estilo itálico ao(s) texto(s) selecionado(s)</span>
                            </v-tooltip>

                        </v-btn-toggle >
                            <div><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                                <v-btn color="white grey--text" v-on="on" fab small dark @click="superScript">
                                    <v-icon>fa-superscript</v-icon>
                                </v-btn></template>
                            <span class="subheading">Aplicar superScript superior a(s) letra(s) achurada(s)</span>
                            </v-tooltip>
                            </div> 
                            <div><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                                <v-btn color="white grey--text" fab small v-on="on" dark @click="subScript"> 
                                    <v-icon>fa-subscript</v-icon>
                                </v-btn></template>
                            <span class="subheading">Aplicar superScript inferior a(s) letra(s) achurada(s)</span>
                            </v-tooltip>
                            </div> 
                            <div><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                                <v-btn color="white grey--text" v-on="on" fab small dark @click="normalScript">
                                    <v-icon>fa-times</v-icon>
                                </v-btn></template>
                            <span class="subheading">Resetar a(s) letra(s) achurada(s) para o formato padrão</span>
                            </v-tooltip>
                            </div>
                        <v-flex><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn class="mx-2" v-on="on" fab dark small color="white grey--text" @click="addText">
                                <v-icon dark>title</v-icon>
                            </v-btn></template>
                            <span class="subheading">Adicionar nova caixa de texto ao canvas</span>
                            </v-tooltip>
                        </v-flex>
                        <v-divider  class="mx-2" vertical></v-divider>
                        <v-flex class="mx-4">
                            <span class="subheading indigo--text mx-1">Escala X:</span>
                        </v-flex>
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
               
                <v-toolbar v-show="lever3" :class="{'borda': canvasMode !== 'portrait',
                                'borda2': canvasMode === 'portrait'}">
                <no-ssr>
                    
                    <v-list v-if="filtroEscolhido === 'produtos'" class="scroll-y">
                        <vue-select-image :useLabel="true" :dataImages="dataImages" h='30px' w='30px' @onselectimage="addImg">
                        </vue-select-image>
                    </v-list>
                     <v-list v-if="filtroEscolhido === 'backgrounds'" class="scroll-y">
                        <vue-select-image :useLabel="true" :dataImages="bgsImages" h='30px' w='30px' @onselectimage="addBg">
                        </vue-select-image>
                    </v-list>
                </no-ssr> 
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
                          <div>
                                <v-btn color="primary"  fab medium dark > 
                                    <v-icon size=40>picture_as_pdf</v-icon>
                                </v-btn>
                            </div>
                            <div>
                                <v-btn color="primary" fab medium dark @click="restoreDefault">
                                    <v-icon size=40>restore</v-icon>
                                </v-btn>
                             </div> 
                    </v-layout>
                </v-toolbar>
            </template>  
        </v-card>
            <v-layout row >
                 <no-ssr>
                    <template>  
                    <chrome-picker class=" teste2" v-model="colors">
                        </chrome-picker>
                    </template>  
                      
                    </no-ssr> 
                    <v-flex sx2> 
                    <span v-if="isDragging" @wheel="wheelOn"  @click="changeTest" @mouseup="mouseUp" @mousedown="mouseDown" @mousemove.stop="mouseMove">
                        <canvas  id="c" class="canvas-wrapper"></canvas>
                    </span>
                    <span  v-else @wheel="wheelOn"  @click="changeTest" @mouseup="mouseUp" @mousedown="mouseDown" @mousemove="mouseMove">
                         <canvas  id="c" class="canvas-wrapper"></canvas>
                        </span>
                    </v-flex>
                </v-layout>
        </div>
</template>

<script>
import alerts from '../../components/campanhas/generalUseComponents/alerts'// ../generalUseComponents/canvasOptions.vue'
import canvasOption from '../../components/campanhas/generalUseComponents/canvasOptions'// ../generalUseComponents/canvasOptions.vue'
import saveCanvas from '../../components/campanhas/generalUseComponents/saveCanvas.vue'// ../generalUseComponents/canvasOptions.vue'
import saveCavasPDF from '../../components/campanhas/generalUseComponents/saveCanvasPDF.vue'// ../generalUseComponents/canvasOptions.vue'
import canvasMove from '../../components/campanhas/generalUseComponents/canvasMove.vue'
import canvasGrid from '../../components/campanhas/generalUseComponents/canvasGrid.vue'
import copiarColar from   '../../components/campanhas/generalUseComponents/copiarColar.vue'
import agrupar from   '../../components/campanhas/generalUseComponents/agruparDesagrupar.vue'
import deletar from  '../../components/campanhas/generalUseComponents/deletar.vue'
import crudMixin from '../../components/mixins/CRUD.js'
import { Compact, Chrome} from 'vue-color'
import {fabric}  from "fabric"
 
export default {
    mixins: [
      crudMixin
    ],
    components:{
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
        alerts
    },
   data: () => ({
        dropdown_edit: [
            {text: '10' },
            { text: '20' },
            { text: '30' },
            { text: '40' },
            { text: '50' },
            { text: '60' },
            { text: '70' },
            { text: '80' },
            { text: '90' },
            { text: '100' },
            { text: '200' },
            { text: '300' },
            { text: '400' },
            { text: '500' }, 
        ],
        toggle_exclusive: 3,
        toggle_grid_exclusive: '',//util,toggle de outro agrupament oe botao
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
        checkGrid: undefined,//checkbox q diz erespeito ao grid
        isDragging: false,
        lastPosX: 0,
        lastPosY: 0,
        altura:0,
        largura:0,
        folha: 'A4',
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
        loading: false,
        currBg: '',//background q ta sendo usado no momento, usado caso a res do canvas mude 
        clipboard: '',
        dpi: 300,
        canvasInfo: {},//fundamental, será uma prop p diversos componentes!
       // imgsList: []
       removeGridFlag: 0,
       lever: true,//lever1 e 2 controlam layout de opcoes e de edicao de texto respectivamente
       lever2: false,
       lever3: true

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
              //  this.updateCanvasInfo()
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
       // this.canvas.setHeight(1540)
        //this.canvas.setWidth(1000)
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
        normalScript(){
            if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                if(this.canvas.getActiveObject().type === 'image' ||this.canvas.getActiveObject().type === 'group'|| this.canvas.getActiveObject().type === 'activeSelection')
                    return
                var active = this.canvas.getActiveObject()
                // if (!active) return;
                active.setSelectionStyles({
                    fontSize: undefined,
                    deltaY: undefined,
                })
                this.canvas.requestRenderAll()
            }    
        },
        superScript() {
            if( this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
               if(this.canvas.getActiveObject().type === 'image' || this.canvas.getActiveObject().type === 'group'|| this.canvas.getActiveObject().type === 'activeSelection')
                    return
                this.normalScript()//restaura antes d alterar
                var active = this.canvas.getActiveObject()
                console.log("NOAO RETORNE ", active)
                active.setSuperscript();
                this.canvas.requestRenderAll()
            }    
        },
        subScript() {
            if( this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                if(this.canvas.getActiveObject().type === 'image' || this.canvas.getActiveObject().type === 'group' || this.canvas.getActiveObject().type === 'activeSelection')
                    return
                this.normalScript()//restaura antes de auterar
                var active = this.canvas.getActiveObject()
                active.setSubscript()
                this.canvas.requestRenderAll()
            }    
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
            this.canvas.setHeight(objeto.data.width)
            this.canvas.setWidth(objeto.data.height)
            this.folha = objeto.data.folha
            console.log(" this,folha ", this.folha , " objeto ",objeto.data)
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
                strokeWidth: 0.5,
                distance: 10
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
            //this.canvas.sendToBack(this.gridGroup)
            this.canvas.bringToFront(this.gridGroup)

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
              
              //  evento.__proto__.defaultPrevented = true
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
        // Xmovement(flag = 0){//andar p direita ou esuqer
        //     var units = 10//caso direita
        //     if(flag === -1)//caso esquerda
        //         units = -units
        //     var delta = new fabric.Point(units,0)
        //     this.canvas.relativePan(delta)
        // },
        // Ymovement(flag = 0){//andar p cima ou p baixo
        //     var units = 10//caso p baixo
        //     if(flag === -1)//caso cima
        //         units = -units
        //     var delta = new fabric.Point(0,units)
        //     this.canvas.relativePan(delta)
        // },
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
//                                alert("hmmm" + this.folha)

               // this.fetchProdList()
                this.canvasInfo = {
                    ref: this.canvas,
                    campanha_id: this.campanha_id,
                    flag: this.currBg !== '' ? this.currBg : undefined,
                    folha: this.folha
                }
                this.fetchProdutos()//console.log("ID: ", this.campanha_id) 
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
            if(this.userType!== 'tabloide'){
                alert("ideia boa mas temq usa bd agora xd" + this.altura + " l " + this.largura)
              //  this.canvas.setHeight(this.altura)
                //this.canvas.setWidth(this.largura)
            
            }
            this.lever = false
            //this.setCanvasDim(3600,2300,'landscape')
           // this.setCanvasDim(1540,1000,'portrait')

        },
        addText(){
            const text = new fabric.IText('Texto',{ top: 100,fontSize: 200})
            this.canvas.add(text)
        },//cria um texto no canvas
        //METODOS RELATIVOS AO CANVAS/FABRIC
        addImg(img,i){
            console.log("adicionando img de indice ",img)
            const relaPath = "../../../uploads/fotos/" + img.name
           
            this.addImgToCanvas(relaPath,img)//parece estranho eu n passar simplesmente img, mas o fabric é eskisito...entao vai assim
          // this.canvas.bringToFront(preco)
            const text = new fabric.IText(img.alt,{ top: 340,fontSize: 200 });
            this.canvas.add(text)
            //this.canvas.bringToFront(text)
            const preco = new fabric.IText(img.preco_v,{ top: 480,fontSize: 200 });
            this.canvas.add(preco)
            
            
       },
       addBg(img,i){
           console.log("vejaa IMGa ", img)
            const relaPath = "../../../uploads/fotos/" + img.name
            this.setBackground(relaPath,img)
            this.currBg = img
            if(this.gridGroup)
                this.canvas.bringToFront(this.gridGroup)//grid ficar sempre atras, caso ele exista
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
@import url('https://fonts.googleapis.com/css?family=Bahianita|PT+Serif|Darker+Grotesque|Indie+Flower|Josefin+Sans|Literata|Oswald|Roboto|Amiri|Cinzel|Patua+One|Permanent+Marker|Righteous|Rokkitt|Vollkorn&display=swap');
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
</style>