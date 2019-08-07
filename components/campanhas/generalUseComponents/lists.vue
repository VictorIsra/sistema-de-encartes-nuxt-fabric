<template>
    <div>
        <v-toolbar>
        <no-ssr>
            <v-list class="scroll-y">
              <vue-select-image :useLabel="true" :dataImages="dataImages" h='50px' w='50px' @onselectimage="onSelectImage">
                </vue-select-image>
            </v-list>
        </no-ssr> 
                            <v-flex xs1>
                            <span class="heading indigo--text">Tag:</span>
                            </v-flex>
                            <v-flex xs2>
                            <v-select
                                :items="tags"
                                v-model="tag"
                            ></v-select>
                            </v-flex>
        </v-toolbar>
    </div> 

</template>
<script>
import crudMixin from '../../../components/mixins/CRUD.js'
import {fabric}  from "fabric"

export default {
    data: () =>({
        aux: [],//filtra oq importa proq é msotrado
        dataImages: [],//guarda oq sera mostrado
        imgs: [],//temporaria, usada como chace 
        tags:[
        ],
        tag: '--',
        itens: []
    }),
    mounted(){
        this.fetchProdutos()
    },
    props: ['canvas','campanha_id'],
    mixins:[crudMixin],
    watch:{
        tag(){
            this.filtraTags()   
        }
    },
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
                console.log("entrou c ",img, "  ser undine? ", img.name === undefined)
                const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
                return path
        },
        getTagsOption(){
             //   if(this.tag === 'todos')
            let samples = []
            this.imgs.forEach(img =>{//troca em fetch p isso funfard novo
                samples.push(img.tag)
                console.log("TAG ",img.tag)
            })
           
               const unique = (value, index, self) => {
                    return self.indexOf(value) === index;
                }
            let distintas = samples.filter(unique)
            this.tags = distintas
       },
        filtraTags(){
            let aux = this.imgs.filter(img => {
                return img.tag === this.tag
            })
            this.dataImages = []
            aux.forEach((img,i) =>{
                this.dataImages.push(img)
                this.dataImages[i].src = this.getImgURL(img)
            })
            this.dataImages.sort(function(a, b){//sortei produtos em ordem alfabetica
                if(a.alt.toLowerCase() < b.alt.toLowerCase()) { return -1; }
                    if(a.alt.toLowerCase() > b.alt.toLowerCase()) { return 1; }
                    return 0;
            })
        },
        async fetchProdutos(){
            if(this.campanha_id === undefined)
                return
            this.itens = await this.getProdutos(this.campanha_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            this.itens.forEach(p => {
                if(p.img !== undefined && p.img !== ''){
                    p.img.alt = p.nome
                    p.img.preco_v = p.preco_v
                    p.img.tag = p.obs
                    this.imgs.push( p.img)
                }    
            })
            this.imgs.forEach((img,i) => {
                //this.aux.push(img)
                //this.aux[i].src = this.getImgURL(img)
                this.dataImages.push(img)
                this.dataImages[i].src = this.getImgURL(img)

            })
            this.getTagsOption()
            this.filtraTags()
            this.aux.sort(function(a, b){//sortei produtos em ordem alfabetica
                if(a.alt.toLowerCase() < b.alt.toLowerCase()) { return -1; }
                    if(a.alt.toLowerCase() > b.alt.toLowerCase()) { return 1; }
                    return 0;
            })
        }, 
        
    }
}
</script>
<style>

</style>
