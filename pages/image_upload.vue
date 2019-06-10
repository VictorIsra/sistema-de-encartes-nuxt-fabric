<template>
    <div>  
        <v-toolbar dark color="primary">
                <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-content>
                <v-container fluid>
                    <v-flex class="text-xs-center text-sm-center text-md-center text-lg-center">
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
                    <v-dialog v-model="dialog" max-width="200px">
                       <!-- <v-card>
                            <v-card-title class="headline">Hello World!</v-card-title>
                            <v-card-text>Image Upload Script in VUE JS
                                <hr>Yubaraj Shrestha
                                <br>http://yubarajshrestha.com.np/</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Close</v-btn>
                            </v-card-actions>
                        </v-card> -->
                    </v-dialog>
                </v-container>
            </v-content>
       </div> 
</template>

<script>
export default {
     data: () => ({
        title: "Upload da imagem",
        dialog: false,
		imageName: '',
		imageUrl: '',
		imageFile: ''
    }),

    methods: {
        pickFile () {
            this.$refs.image.click ()
        },
		
		onFilePicked (e) {
			const files = e.target.files
			if(files[0] !== undefined) {
				this.imageName = files[0].name
				if(this.imageName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result
					this.imageFile = files[0] // this is an image file that can be sent to server...
				})
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
		}
    }
}
</script>
