<template>
    <div >  
        <v-flex  > 
                <img :src="imageUrl" height="150" v-if="imageUrl"/>
                <v-text-field label="Selecione uma imagem" @click='pickFile' v-model='imageName' prepend-icon='attach_file'></v-text-field>
                <input
                    type="file"
                    style="display: none"
                    ref="image"
                    accept="image/*"
                    @change="onFilePicked"
                >
        </v-flex>
        <v-dialog v-model="dialog"  max-width="200px">
            SOU DIALOGO
        </v-dialog>    
    </div> 
</template>

<script>
//obs: "append() bota a data na ultima posicao de um vetor, prepend() bota na primeira posicao"
export default {
     data: () => ({
        title: "Upload da imagem",
        dialog: false,
		imageName: '',
		imageUrl: '', //a principo nao salvaria no bd, mas tvz seja uma info interessante
        imageFile: '',//arquivo que irei salvar no bd
    }),

    methods: {
        pickFile () {
            this.$refs.image.click ()
        },
		
		onFilePicked (e) {
            console.log("targfile",e.target.files) //mostra o elemento do input, mas quero é os files. logo, linah abaixo:
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
                    console.log("img url:", this.imageUrl)
                    console.log("imagefile(bd): ", this.imageFile)
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
