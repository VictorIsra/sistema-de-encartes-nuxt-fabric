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
              folha: 'a4',
              sangramento: 3
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
        },
        async gerarPDF(){
         //     const html2canvas = require('html2canvas')
           //    window.html2canvas = html2canvas
            const jsPDF = require('jspdf')
            let mode = 'landscape'
           // let canvas = await html2canvas(document.getElementById('c'))
            //    .then((canvas) => {
                
                    if(this.canvas.ref.width <= this.canvas.ref.height)
                        mode = "portrait"
                    
                    let pdf = new jsPDF(mode, "mm",this.canvas.folha,true)//essencial msmm, mudand o de de p p l ou n
                    
                    var bgcache = this.canvas.ref.backgroundImage//copia o bg pra seta-lo novamente ( pois irei seta-lo p undefined ja,ja) apos gerar o pdf
                    //1**comente prox linha p ver margem de seguranca */
                   var bgT = this.canvas.ref.backgroundImage.toDataURL('image/png',1.0)//COMENTE PARA VER A MARGEM DE SEGURANCA
                    //adicione o bg ao pdf, o bg aqui é do tamanho da folha, e parte do bg será perdido SIM, mas n é isso que é essencial proteger
                    //2**comente prox linha p ver margem de seguranca */
                    await pdf.addImage(bgT, 'JPEG',0,0,pdf.internal.pageSize.getWidth(),pdf.internal.pageSize.getHeight(),undefined,'FAST')//COMENTE P VER A MARGEM DE SEGURANC
                    //removo o bg dps de adiciona-lo ao pdf na linha acima para que ele nao
                    //adicione o bg duas vezes, evitando assim que demore mt pra gerar o pdf, e mais
                    //essencial ainda, inpede que tenha um bg interno e um externo!! essencial setar pra undefined
                    //3*comente prox linha p ver a margem de seguranca
                   this.canvas.ref.backgroundImage = undefined//garante q a sangria dira respeito apenas a td q nao for bg
                    
                    var  imgData =   this.canvas.ref.toDataURL('image/png',1.0)
                    //o sangramento aqui na verdade é uma margem de seguranca interna
                    let width = pdf.internal.pageSize.getWidth() -(2* this.canvas.sangramento)
                    let height = pdf.internal.pageSize.getHeight() -( 2 * this.canvas.sangramento )
                
                    pdf.addImage(imgData, 'JPEG',this.canvas.sangramento,this.canvas.sangramento, width,height, undefined,'FAST')
                    await pdf.save('tabloide.pdf')
                    this.canvas.ref.backgroundImage = bgcache//restauro o bg
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