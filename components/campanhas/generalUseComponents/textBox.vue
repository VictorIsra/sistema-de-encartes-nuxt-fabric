<template>
    <v-flex><v-tooltip bottom>
        <template v-slot:activator="{ on }" v-on="on">
        <v-btn class="mx-2" v-on="on" fab dark small color="white grey--text" @click="addText">
            <v-icon dark>title</v-icon>
        </v-btn></template>
        <span class="subheading">Adicionar nova caixa de texto ao canvas</span>
        </v-tooltip>
    </v-flex>
</template>
<script>
export default {
    data:() =>({

    }),
    props: ['canvas'],
    methods: {
        addText(){
            if(this.canvas !== undefined){
                const text = new fabric.IText('Texto',{ top: 100,fontSize: 200})
                this.canvas.add(text)
            }
        }
    }
}
</script>
