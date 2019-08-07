<template>
    <div>
        <v-toolbar>
        <no-ssr>
            <v-list class="scroll-y">
              <vue-select-image :useLabel="true" :dataImages="compleImages" h='50px' w='50px' @onselectimage="addComple">
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
        comple:[],//img complementares
        compleImages: [],
        imgs: [],//temporaria, usada como chace 
        itens: [],
    }),
    mounted(){
        this.fetchProdutos()
    },
    props: ['canvas'],
    mixins:[crudMixin],
    watch:{
        
    },
    methods:{
        async fetchProdutos(){
            if(this.canvas !== undefined){
                let complementar_id = "5d478c3082c8e55273f6bad1"
                this.itens = await this.getProdutos(complementar_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
                this.itens.forEach(p => {
                    if(p.img !== undefined && p.img !== '')
                        this.comple.push( p.img)  
                })
                this.comple.forEach((img,i) => {
                    this.compleImages.push(img)
                    this.compleImages[i].src = this.getImgURL(img)

                })
            }    
        },    
        getImgURL(img){
        //se uma img nao tiver sido escolhida, retorne enm branco
        console.log("entrou c ",img)
        const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
        return path
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
                if(this.canvas !== undefined)
                    this.canvas.add(temp)
               // if(this.gridGroup)
                //    this.canvas.bringToFront(this.gridGroup)//grid ficar sempre atras, caso ele exista
            })//{canvas: canvas})//n funciona passar esse arg...doc lixoooo
        },
    }
}
</script>
<style>

</style>
