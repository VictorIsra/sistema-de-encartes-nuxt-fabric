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
        </v-layout>
        
    </div>
</template>
<script>
import crudMixin from  '../../../components/mixins/CRUD.js'

export default {
    data: () => ({
        
    }),
    props: {
         canvas: {//tabela precisa q as datas fiquem dentro de um intervalo, daí ela envia essa prop preenchida
          type: Object,
          default: function(){
            return{
              ref: undefined,
              campanha_id: undefined,
              flag:undefined
            }  
          }
        },
    },    
    mixins: [
      crudMixin
    ],
    methods:{
      /*  async salvarTabloide(){
            //this.checkGrid = false
            //await this.removeGrid()
            if(this.canvas.ref !== undefined && this.canvas.campanha_id !== undefined){
                alert("salvarei")
                var json = JSON.stringify(this.canvas.ref.toJSON())
                if(this.canvas.flag)//this.currBg !== '')
                    this.saveTabloide(json,this.canvas.campanha_id,this.canvas.flag)
                else
                    this.saveTabloide(json,this.canvas.campanha_id)
                console.log("salvo com sucesso.")
            }
            else
               console.log("n pude salvar tabloide <componente pdfhandler.vue>")
           
        },*/
         async salvarPdf(){
                if(this.canvas.ref !== undefined){
                    this.canvas.ref.discardActiveObject()//deselect, p n salvar com a markinha das opcoes
                    //this.restoreDefault()//restaura td pra posicao inicial ( tira zoom e panning)
                // this.checkGrid = false//desabilita o grid("")
                //   await this.removeGrid()
                //   this.canvas.renderAll()        
                    const jsPDF = require('jspdf')
                //  const html2canvas = require('html2canvas')
                // window.html2canvas = html2canvas
                    let mode = "landscape"
                //  var imgData = await this.canvas.toDataURL('image/png',1.0)
                // let canvas = await html2canvas(document.getElementById('c'))
                    //  .then((canvas) => {
                            var imgData =  this.canvas.ref.toDataURL('image/png',1.0)
                            if(this.canvas.ref.width <= this.canvas.ref.height)
                                mode = "portrait"
                            let pdf = new jsPDF(mode, "mm",'a4')//this.folha)//essencial msmm, mudand o de de p p l ou n
                            let prod = this.canvas.ref.width * this.canvas.ref.height
                            // if( prod >= 5000) //canvas maior q isso é invalido, mt grande...ai retorn
                            //     retur
                            let width = pdf.internal.pageSize.getWidth()
                            let height = pdf.internal.pageSize.getHeight()

                            pdf.addImage(imgData, 'JPEG',0,0, width,height)
                            pdf.save('tabloide.pdf')
                    //  })
            }
               
        },
    
    }
    
}
</script>
