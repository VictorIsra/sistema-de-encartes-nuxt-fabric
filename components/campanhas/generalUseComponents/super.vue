<template>
   <div>
        <v-layout>
         <div>
             <v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                                <v-btn color="white grey--text" v-on="on" fab small dark @click="superScript">
                                    <v-icon>fa-superscript</v-icon>
                                </v-btn></template>
                            <span class="subheading">Aplicar superScript superior a(s) letra(s) achurada(s)</span>
                            </v-tooltip>
            </div> 
                <div><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                                <v-btn color="white grey--text" fab small v-on="on" dark @click="subScript"> 
                                    <v-icon>fa-subscript</v-icon>
                                </v-btn></template>
                            <span class="subheading">Aplicar superScript inferior a(s) letra(s) achurada(s)</span>
                            </v-tooltip>
                </div>
                <div><v-tooltip bottom>
                            <template v-slot:activator="{ on }" v-on="on">
                                <v-btn color="white grey--text" v-on="on" fab small dark @click="normalScript">
                                    <v-icon>fa-times</v-icon>
                                </v-btn></template>
                            <span class="subheading">Resetar a(s) letra(s) achurada(s) para o formato padrão</span>
                </v-tooltip>
            </div>
        </v-layout>
    </div>
</template>
<script>
export default {
    data: () => ({

    }),
    props:['canvas'],
    methods:{
        normalScript(){
            if(this.canvas !== undefined){
                if(this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                    if(this.canvas.getActiveObject().type === 'image' ||this.canvas.getActiveObject().type === 'group'|| this.canvas.getActiveObject().type === 'activeSelection')
                        return
                    var active = this.canvas.getActiveObject()
                    // if (!active) return;
                    active.setSelectionStyles({
                        fontSize: undefined,
                        deltaY: undefined,
                    })
                    this.canvas.requestRenderAll()
                }
            }        
        },
        superScript() {
            if(this.canvas !== undefined){
                if( this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                if(this.canvas.getActiveObject().type === 'image' || this.canvas.getActiveObject().type === 'group'|| this.canvas.getActiveObject().type === 'activeSelection')
                        return
                    this.normalScript()//restaura antes d alterar
                    var active = this.canvas.getActiveObject()
                    active.setSuperscript();
                    this.canvas.requestRenderAll()
                }
            }    
        },
        subScript() {
            if(this.canvas !== undefined){
                if( this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null){
                    if(this.canvas.getActiveObject().type === 'image' || this.canvas.getActiveObject().type === 'group' || this.canvas.getActiveObject().type === 'activeSelection')
                        return
                    this.normalScript()//restaura antes de auterar
                    var active = this.canvas.getActiveObject()
                    active.setSubscript()
                    this.canvas.requestRenderAll()
                }
            }       
        },
    }
}
</script>
