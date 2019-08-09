<template>
  <div class="text-center">
   

    <v-snackbar
    v-model="snackAux"
    :multi-line="multiLine"
    :timeout="timeOut"
    color="success"
    >
      {{ msg }}
      
    </v-snackbar>
  </div>
</template>
<script>
  export default {
    data: () => ({
        timeOut: 3500,
        multiLine: true,
        snackAux: false
       // snackbar: false,
       // text: 'produtos enviados para usuário tabloide com sucesso!',
    }),
    props: {
         snackbar: {//tabela precisa q as datas fiquem dentro de um intervalo, daí ela envia essa prop preenchida
          type: Boolean,
          default: false
        },
        msg:{
            type:String,
            default: 'mensagem genérica'
        }
    },   
    watch:{
        snackbar(){
            this.snackAux = this.snackbar
            if(this.snackAux === false)
                this.closeTrigger()//fechara dps de 2500s
        }
    },
    methods:{
        closeTrigger(){
            setTimeout(() => {
               // this.snackbar = false
            }, this.timeOut)
        },
        openTrigger(){
           // this.snackbar = true
        },
        close(){

        }

    }
  }
</script>