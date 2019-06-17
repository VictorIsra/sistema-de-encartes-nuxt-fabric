<template>
    <div >  
        <v-flex> 
           <!-- <img :src="image" width="50px" height="50px"/>-->
                <img :src="imageUrl" height="50px" v-if="imageUrl"/>
                <v-text-field label="Selecione uma imagem" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
                <input
                    type="file"
                    style="display: none"
                    ref="image"
                    accept="image/*"
                    @change="onFilePicked"
                >
        </v-flex>
        <!--<v-dialog v-model="dialog"  max-width="200px">
            SOU DIALOGO
        </v-dialog>    -->
    </div> 
</template>

<script>
//como só aceita imagem na input, n adianta tentar usar o rule pra dar um output de erro ( pois esta ultima é string, n img)
//obs: "append() bota a data na ultima posicao de um vetor, prepend() bota na primeira posicao"
export default {
     data: () => ({
        dialog: false,
        imageUrl: '',
		imageName: '',
        imageFile: '',//arquivo que irei salvar no bd e q é capaz de
        //de ser convertido numa img de fato, alem de conter info do nome, tamanho etc
    }),
    props: {
        imgInfo: {
            type: Object,
            default: function(){
                return {
                    imgName: '',
                    imgURL: '',
                    imgFile: '',
                    flag: 0
                }
            }
        }
    },
    watch: {
        'imgInfo.flag':{//assim a img e nome associado estaram corretos qd um dialog abrir
            handler(){
                let tempURL = ''
                let tempFile = ''
                let tempName
                if(this.imgInfo.flag === 1){
                    tempURL = this.imgInfo.imgURL
                    tempFile = this.imgInfo.imgFile
                    tempName = this.imgInfo.imgName

                    this.imageUrl= tempURL
                    this.imageFile = tempFile
                    this.imageName = tempName
                }
                else{
                    this.clearInput()
                }
            }
        }
    },
    methods: {
        pickFile () {
            this.$refs.image.click ()
        },
		onFilePicked (e) {
             // e.target.files mostra o elemento do input, mas quero é os files. logo, linah abaixo:
			const files = e.target.files//objeto com nome da img,tamanho,tipo,data de modificacao
			if(files[0] !== undefined) {
				this.imageName = files[0].name
				if(this.imageName.lastIndexOf('.') <= 0) {
					return
                }
                if(files[0].type.match('image/*'))
                   console.log("é img!")
                else{//n é img
                    this.clearInput()
                    return
                }      
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result
					this.imageFile = files[0] // arquivo da img que posso mandar pro server/bd/back-end...
                    console.log("ARQ Q SALVO NO BD: ", this.imageFile)
                    this.$emit('imgUploaded',{
                        file: this.imageFile,
                        name: this.imageName,
                        url: this.imageUrl
                    })      
                })
			} else {
				this.clearInput()
			}
        },
        clearInput(){
            this.imageName = ''
			this.imageFile = ''
			this.imageUrl = ''
        }
    }
}
</script>
