<template>
    <v-layout justify-end>
        <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn class="mx-2" fab dark small color="primary" @click="openDialog" v-on="on">
                <v-icon dark>extension</v-icon>
            </v-btn>
        </template>
        <span class="subheading">Adicionar imagens complementares</span>
        </v-tooltip>  
        <v-dialog v-model="dialog" persistent max-width="700">
        <v-card>
            <v-card-title class="headline primary--text">Imagens complementares cadastradas:</v-card-title>
            <v-card-text>
                 <v-layout class="justify-center">
                    <v-flex xs5>
                    <img-upload :imgInfo="imgInfo" @imgUploaded="fillCachedImgInfo"/>
                    </v-flex> 
                    <v-flex xs1> 
                       <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn class="mx-2" fab dark small @click="save(-1)" color="primary" v-on="on">
                                    <v-icon dark>save</v-icon>
                                </v-btn>
                            </template>
                            <span class="subheading">Salvar background</span>
                        </v-tooltip> 
                    </v-flex>
                </v-layout>
                    <v-card-text  class="sub-heading primary--text">Clique numa imagem na lista abaixo para remove-la:</v-card-text>
                <v-toolbar class="borda">
                 <no-ssr>
                    <v-list class="scroll-y">
                        <vue-select-image :useLabel="true" :dataImages="dataImages" h='30px' w='30px' @onselectimage="addImg">
                        </vue-select-image>
                    </v-list>
                </no-ssr> 
                </v-toolbar>    
            <v-card>
            </v-card>    
            </v-card-text>       
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="close">Fechar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-layout>    
</template>

<script>
import crudMixin from '../../mixins/CRUD.js'
import imgUpload from '../generalUseComponents/image_upload.vue'


export default {
    mixins: [
      crudMixin
    ],
    components:{
        'img-upload': imgUpload
    },
    data: () => ({
        cachedImgInfo: {
            imgName: '',//só o nome da img
            imgFile: '',//objeto que pode ser salvo no db e posteriormente renderizado em uma img,inclusive
            imgURL: '',
        },
          imgInfo: {
          imgName: '',
          imgURL: '',
          imgFile: '',
          flag: 0
        },
        dialog: false,
        dataImages: [],
        itens: [],
        img: [],
        campanha_id: '5d478c3082c8e55273f6bad1'//campanha relativa aos backgrounds, é unica no codigo
    }),
    created(){
        this.fetchProdutos()
    },
    methods:{
        addImg(img){
            img.src = "static/uploads/fotos/" + img.name
           this.removeRow(img.row_id,img.src,this.campanha_id)
           this.dataImages.forEach((it,i)=>{
               if(it.src === img.src){
                    this.img.splice(i,1)
                    this.dataImages.splice(i,1)
               }
           })
        },
        openDialog(flag){
            
            this.imgInfo.flag = flag
            this.resetImgCached()
            this.imgInfo.flag = 0
            this.dialog = true

        },
        async save(flag){
            this.imgInfo.flag = flag
            let item = { img: this.dataImages}
            let flag2 = await this.fillImgInfo('',item)//retornara se salvou alguma img ou a entrada era nula e usara isso como flag
            if(flag2 != -1){
                

                item.img.src = "static/uploads/fotos/" + item.name
                const row_id = await this.addRow(item,this.campanha_id)//na real nem precisava passa isso como arg mas foda-se
                item.img._id = row_id
                item.img.src = this.getImgURL(item.img)
                this.dataImages.push(item.img)
                this.resetImgCached()
                this.imgInfo.flag = 0

            }
           
        },
        async fetchProdutos(){
            this.itens = await this.getProdutos(this.campanha_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            this.itens.forEach((p,i) => {
                if(p.img !== undefined && p.img !== ''){
                    this.img.push( p.img)
                    this.img[i].row_id = p._id
                }    
            })
            this.img.forEach((img,i) => {
                this.dataImages.push(img)
                this.dataImages[i].src = this.getImgURL(img)

            })
        },
        fillCachedImgInfo(data){//componente filho img-upload enviará um evento e esta f será triggada por este evento
        //cacheio esses resultados e só associo a variavel 'itens' qd o usuario quiser salvar de fato a img
            this.cachedImgInfo.imgName = data.name
            this.cachedImgInfo.imgFile = data.file
            this.cachedImgInfo.imgURL = data.url
        }, 
        getImgURL(img){
        //se uma img nao tiver sido escolhida, retorne enm branco
        console.log("imag ", img.name === undefined)
        const path = img.name === undefined ? "" : "../../../uploads/fotos/" + img.name
        console.log("path é ", path)
            if(path === '')
                return
            else{
                return path
            }
        },
        close () {
        this.resetImgCached()
        this.imgInfo.flag = 0
        this.dialog = false

      },
      resetImgCached(){
        //reseta os valores cacheados, pois ao se fechar, preciso setar eles pra '', se nao é possivel q eu atualize uma foto sem querer, simplesmente pq escolhi uma ( mas dps cancelei), com essa f, garanto que, se eu ecolher algo mas dps fechar o dialog sem salvar, nenhuma img nova sera salva xD
       //eu ja fazia essa operacoa antes, mas o segredo é faze-la neste nesta f, no momento de fechar, e n apenas num save da vida
        this.cachedImgInfo.imgName = ''
        this.cachedImgInfo.imgFile = ''
        this.cachedImgInfo.imgURL = ''
      },
      async fillImgInfo(newItemIndex = '', editedItem){  
        //LEMBRE: img name e url parecem inuteis a lvl de bd, mas sao fundamentais pro usuario interagir/ver a lvl de app!
         //só guardarei a foto escolhida se ele salvou algo, se nao, nao
        //sera chamada se o user de fato quis salvar uma img e ela nao for em branco, pois caso seja, n tem objeto pra criar e daria erro!
        if(this.cachedImgInfo.imgFile !== '' && newItemIndex === ''){//caso editando algo existente c img
          //console.log("entreii com ",  this.imgInfo.imgFile, " novo ", editedItem.img.src)
          await this.imgUpload(this.cachedImgInfo.imgFile,editedItem)
          return 1
        }
        else{
            return -1
        }
      }
    }
}      
</script>
<style>
 .borda{
    border: 4px ridge #1976D2;
 }
</style>
