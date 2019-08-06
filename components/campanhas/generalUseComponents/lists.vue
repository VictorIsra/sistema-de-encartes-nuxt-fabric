<template>
    <div>
        <v-toolbar>
        <no-ssr>
            <v-list class="scroll-y">
              <vue-select-image :useLabel="true" class="cor" :dataImages="dataImages" h='50px' w='50px' @onselectimage="onSelectImage">
                </vue-select-image>
            </v-list>
        </no-ssr> 
        </v-toolbar>
    </div>                   
</template>
<script>
import crudMixin from '../../../components/mixins/CRUD.js'
import {fabric}  from "fabric"

export default {
    data: () =>({
        dataImages: [],
        imgs: [],//temporaria, usada como chace intermediario
    }),
    mounted(){
        this.fetchProdutos()
    },
    props: ['canvas','campanha_id'],
    mixins:[crudMixin],
    methods:{
        onSelectImage(img){
            console.log("clickei   em ", img)
            console.log("adicionando img de indice ",img)
            const relaPath = "../../../uploads/fotos/" + img.name
           
            this.addImgToCanvas(relaPath,img)//parece estranho eu n passar simplesmente img, mas o fabric é eskisito...entao vai assim
          
            const text = new fabric.IText(img.alt,{ top: 340,fontSize: 200 });
            this.canvas.add(text)
                    //this.canvas.bringToFront(text)
            const preco = new fabric.IText(img.preco_v,{ top: 480,fontSize: 200 });
            this.canvas.add(preco)   
        },addImgToCanvas(path,img){//fabric salvará essas imgs e poderei as referencias
            fabric.Image.fromURL(path,(img)=>{
                img.scaleToWidth(350)//dif de crop, aqui literalmente "redimensiona"
                img.scaleToHeight(350)
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
               // if(!this.tobg){
                this.canvas.add(temp)
               // if(this.gridGroup)
                  //  this.canvas.bringToFront(this.gridGroup)//grid ficar sempre atras, caso ele exista
            })//{canvas: canvas})//n funciona passar esse arg...doc lixoooo
        },
            getImgURL(img){
                //se uma img nao tiver sido escolhida, retorne enm branco
                console.log("entrou c ",img)
                const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
                return path
            },
            async fetchProdutos(){
                            if(this.campanha_id === undefined)
                                return
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
            // let campanhaBg_id = "5d4223b924a1f1483c193259"
            // this.itens = await this.getProdutos(campanhaBg_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            // this.itens.forEach(p => {
            //     if(p.img !== undefined && p.img !== '')
            //         this.bgs.push( p.img)  
            // })
            // this.bgs.forEach((img,i) => {
            //     this.bgsImages.push(img)
            //     this.bgsImages[i].src = this.getImgURL(img)

            // })
            this.dataImages.sort(function(a, b){//sortei produtos em ordem alfabetica
                if(a.alt.toLowerCase() < b.alt.toLowerCase()) { return -1; }
                    if(a.alt.toLowerCase() > b.alt.toLowerCase()) { return 1; }
                    return 0;
            })
            // let complementar_id = "5d478c3082c8e55273f6bad1"
            // this.itens = await this.getProdutos(complementar_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            // this.itens.forEach(p => {
            //     if(p.img !== undefined && p.img !== '')
            //         this.comple.push( p.img)  
            // })
            // this.comple.forEach((img,i) => {
            //     this.compleImages.push(img)
            //     this.compleImages[i].src = this.getImgURL(img)

            // })
            // n tem texr associado ainda this.compleImages.sort(function(a, b){//sortei produtos em ordem alfabetica
            //     if(a.alt.toLowerCase() < b.alt.toLowerCase()) { return -1; }
            //     if(a.alt.toLowerCase() > b.alt.toLowerCase()) { return 1; }
            //     return 0;
            // })
        }, 
        
    }
}
</script>
<style>
.cor {
}
</style>
