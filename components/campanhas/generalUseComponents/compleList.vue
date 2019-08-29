<template>
    <div>
        <v-toolbar v-if="compleImages.length > 0">
        <no-ssr>
            <v-list class="scroll-y">
              <vue-select-image :useLabel="true" :dataImages="compleImages" h='50px' w='50px' @onselectimage="addComple">
                </vue-select-image>
            </v-list>
        </no-ssr> 
        </v-toolbar>
        <v-toolbar v-else class="white--text primary">
        <v-flex class="text-xs-center">
            <span>
            Ainda não há imagens complementares cadastradas no sistema.
            </span>
        </v-flex>
        </v-toolbar>
    </div> 
</template>
<script>
import complementarMixin from '../../../components/mixins/complementarMixin.js'
import {fabric}  from "fabric"

export default {
    data: () =>({
        comple:[],//img complementares
        compleImages: [],
        imgs: [],//temporaria, usada como chace 
        itens: [],
        lastAdded: undefined//objeto mais recente addicionado ao canvas
    }),
    mounted(){
        this.fetchComplementar()
    },
    props: ['canvas'],
    mixins:[complementarMixin],
    watch:{
        
    },
    methods:{
        async fetchComplementar(){
            if(this.canvas !== undefined){
                this.itens = await this.getComplementar()///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
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
        //console.log("entrou c ",img)
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
                   
                if(this.canvas !== undefined){
                    if(this.lastAdded !== undefined){
                        temp.set({left: this.lastAdded.left + 20,
                                top: this.lastAdded.top + 20})
                        this.canvas.add(temp)
                        this.canvas.setActiveObject(temp)
                    }
                    this.lastAdded = temp

                }   
                

               // if(this.gridGroup)
                //    this.canvas.bringToFront(this.gridGroup)//grid ficar sempre atras, caso ele exista
            })//{canvas: canvas})//n funciona passar esse arg...doc lixoooo
        },
    }
}
</script>
<style>

</style>
