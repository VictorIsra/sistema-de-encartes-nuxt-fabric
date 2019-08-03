<template>
  <div class="text-center">
    <v-btn
      dark
      color="red darken-2"
      @click="snackbar = true"
    >
      Open Snackbar
    </v-btn>

    <v-snackbar
    v-model="snackbar"
    :multi-line="multiLine"
    :timeout="timeOut"
    >
      {{ text }}
      
    </v-snackbar>
  </div>
</template>
<script>
  export default {
    data: () => ({
        timeOut: 1500,
        multiLine: true,
        snackbar: false,
        text: 'msg padrao',
    }),
    watch:{
        snackbar(){
            if(this.snackbar)
                this.closeTrigger()//fechara dps de 2500s
        }
    },
    methods:{
        closeTrigger(){
            setTimeout(() => {
                this.snackbar = false
            }, this.timeOut)
        },
        openTrigger(){
            this.snackbar = true
        },
        close(){

        }

    }
  }
</script>