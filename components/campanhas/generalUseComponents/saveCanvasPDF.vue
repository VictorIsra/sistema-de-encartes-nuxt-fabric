<template>
    <div>
        <v-layout>
        <div>
            <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" fab medium dark @click="salvarPdf">
                    <v-icon size=40>picture_as_pdf</v-icon>
                </v-btn> 
            </template>
            <span class="subheading">Baixar PDF desde tablóide</span>
            </v-tooltip>
        </div>
        <div class="text-center ma-2">
            <v-snackbar
            v-model="snackBar.snackbar"
              :timeout="timeout"
              
            >
            <span class="subheading" color="red--text">
            {{ snackBar.text }}</span>
       
        </v-snackbar>
        </div> 
        </v-layout>
    </div>
</template>
<script>
import crudMixin from  '../../../components/mixins/CRUD.js'

export default {
    data: () => ({
        snackBar:{
            color: '',
            mode: '',
            snackbar: false,
            text: 'Gerando arquivo, por favor aguarde...',
            timeout: 6000,
            x: null,
            y: 'top',
        },
         timeout:2000
    }),
    props: {
         canvas: {//tabela precisa q as datas fiquem dentro de um intervalo, daí ela envia essa prop preenchida
          type: Object,
          default: function(){
            return{
              ref: undefined,
              campanha_id: undefined,
              flag:undefined,
              folha: 'a4'
            }  
          }
        },
    },    
    mixins: [
      crudMixin
    ],
    methods:{
         async salvarPdf(){
             this.snackBar.snackbar = true
             
             setTimeout(()=>{
                 if(this.canvas.ref !== undefined){
                    this.canvas.ref.discardActiveObject()//deselect, p n salvar com a markinha das opcoes
                    this.resetStatus()//restaura td pra posicao inicial ( tira zoom e panning)
               this.gerarPDF()     
            
                 }
             }, 500)
                 
             //    })
             
               
        },
        async gerarPDF(){
         //     const html2canvas = require('html2canvas')
           //    window.html2canvas = html2canvas
            const jsPDF = require('jspdf')
            let mode = 'landscape'
           // let canvas = await html2canvas(document.getElementById('c'))
            //    .then((canvas) => {
                var  imgData =   this.canvas.ref.toDataURL('image/png',1.0)
                    if(this.canvas.ref.width <= this.canvas.ref.height)
                        mode = "portrait"//LEMBRE DE BOTAR THIS.FOLHA ESSENCIALLL FAZE DPS JANTAR
                    let pdf = new jsPDF(mode, "mm",this.canvas.folha)//essencial msmm, mudand o de de p p l ou n
                   // let prod = this.canvas.ref.width *this.canvas.ref.height
                                // if( prod >= 5000) //canvas maior q isso é invalido, mt grande...ai retorn
                                //     retur
                    let width = pdf.internal.pageSize.getWidth()
                    let height = pdf.internal.pageSize.getHeight()

                    pdf.addImage(imgData, 'JPEG',0,0, width,height)
                    pdf.save('tabloide.pdf')
              //  })   
        },
        resetStatus(){
            if(this.canvas.ref !== undefined){
                this.canvas.ref.setZoom(1)
                //reset o canvas para o status inicial
                this.canvas.ref.setViewportTransform([1,0,0,1,0,0]) 
                this.canvas.ref.renderAll()
            }
        }
    
    }
    
}
</script>