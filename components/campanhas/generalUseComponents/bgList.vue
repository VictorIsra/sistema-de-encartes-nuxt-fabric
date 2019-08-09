<template>
    <div>
        <v-toolbar>
        <no-ssr>
            <v-list class="scroll-y">
              <vue-select-image :useLabel="true" :dataImages="bgsImages" h='50px' w='50px' @onselectimage="addBg">
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
        bgsImages: [],//guarda oq sera mostrado
        imgs: [],//temporaria, usada como chace 
        bgs: [],
        pathInfo: {
            img: '',
            path: ''
        },
        usingBg:''
    }),
    mounted(){
        this.fetchProdutos()
    },
    props: ['canvas','currBg','flag'],
    mixins:[crudMixin],
    watch:{
        flag(){
            this.usingBg = this.canvas.backgroundImage
             console.log("vejamo ", this.canvas.backgroundImage)

            if(this.usingBg === '' || this.usingBg === undefined || this.usingBg === null ){
                this.usingBg = this.bgsImages[0]//aplica uma img default na ausencia de uma
                this.addBg(this.usingBg)
            }//aprece idiota mas essa logic q rola
            //console.log("veee aa ", this.usingBg ," <--")
            else if(this.usingBg !== '' && this.usingBg !== undefined && this.usingBg !== null)
                this.addBg2(this.usingBg)
        },
    },
    methods:{
        addBg2(){
            if(this.canvas.backgroundImage !== null){
                this.canvas.setBackgroundImage(this.canvas.backgroundImage,this.canvas.renderAll.bind(this.canvas), {
                scaleX: this.canvas.width /this.canvas.backgroundImage.width,
                scaleY: this.canvas.height /this.canvas.backgroundImage.height})
            }
        },
        addBg(img){
            if(img !== undefined){
                const relaPath = "../../../uploads/fotos/" + img.name
                this.pathInfo.img = img
                this.pathInfo.path = relaPath 
                this.setBackground(relaPath,img)
            }
        },
         setBackground(path,img){
            fabric.Image.fromURL(path,(img)=>{
                let temp = img.set({ left: 0, top: 0 })// faz um crop:,width:500,height:500})
                this.canvas.setBackgroundImage(temp,this.canvas.renderAll.bind(this.canvas), {
                scaleX: this.canvas.width / temp.width,
                scaleY: this.canvas.height /temp.height})
            })
        },    
        async fetchProdutos(){
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
        }, 
        getImgURL(img){
        //se uma img nao tiver sido escolhida, retorne enm branco
        console.log("entrou c ",img)
        const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
        return path
        },
        
    }
}
</script>
<style>

</style>
