<template>
        <v-btn-toggle v-model="togglea" mandatory>
                            <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                             <v-btn :value="3" v-on="on" text @click="checkFontStyle('normal')">
                            <v-icon>text_fields</v-icon>
                            </v-btn> </template>
                            <span class="subheading">Aplicar estilo padrão ao(s) texto(s) selecionado(s)</span>
                            </v-tooltip><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn :value="1" text @click="checkFontStyle('Bold')" v-on="on">
                            <v-icon>format_bold</v-icon>
                            </v-btn> </template>
                            <span class="subheading" >Aplicar estilo negrito ao(s) texto(s) selecionado(s)</span>
                            </v-tooltip><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                            <v-btn :value="2" v-on="on" text @click="checkFontStyle('Italic')">
                            <v-icon>format_italic</v-icon>
                           </v-btn></template>
                            <span class="subheading">Aplicar estilo itálico ao(s) texto(s) selecionado(s)</span>
                            </v-tooltip>

                        </v-btn-toggle >
</template>
<script>
export default {
    data:()=>({
        togglea: ''
    }),
    //'fontStyle', this.toggle_exclusive)
    props:['canvas','toggle'],
    watch:{
         toggle(){
             this.togglea = this.toggle
            this.handler('fontStyle', this.toggle)
        },
        togglea(){
            this.handler('fontStyle', this.togglea)

        }
    },
    methods:{
           checkFontStyle(style){//checa o tipo de estilo de fonte selecionada ou nao no painel e retorna
            let st = ''
            if(style === 'Bold'){
                st= 1
            }    
            else if(style === 'Italic')
                st = 2
            else if( style === 'normal')
               st = ''
            this.$emit('tstyle',st)    
                
        }, 
        handler(event,value = false){
            if(this.canvas !== undefined){
                  if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                let doomedObj = this.canvas.getActiveObject()
                    if (doomedObj.type === 'activeSelection') {
                           doomedObj.canvas = this.canvas
                       if(event === 'fontStyle'){

                        let style = 'normal'
                        if(value === 1)
                            style = 'Bold'
                        else if(value === 2)
                            style = 'Italic'  
                        doomedObj.forEachObject((obj) => {
                            obj.set("fontStyle", style)
                        })

                        }
                    }
                    else{
                //um unico objeto selecionado
                        var activeObject = this.canvas.getActiveObject();
                        if(activeObject !== null ) {
                           if(event === 'fontStyle'){
                                let style = 'normal'
                                if(value === 1)
                                    style = 'Bold'
                                else if(value === 2)
                                    style = 'Italic'  
                                this.canvas.getActiveObject().set("fontStyle", style)
                            }
                        }  
                    }
                    this.canvas.renderAll()
                }
            }
          
        } 
    }  
}
</script>
