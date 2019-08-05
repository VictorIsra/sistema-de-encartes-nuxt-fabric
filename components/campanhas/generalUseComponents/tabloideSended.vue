<template>
  <div class="text-center">
   

    <v-snackbar
    v-model="snackbar"
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
            if(this.snackbar === false)
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