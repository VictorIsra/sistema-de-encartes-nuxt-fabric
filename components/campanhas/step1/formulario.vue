<template>

  <v-form
    ref="form"
    v-model="valid"
  > 
    <v-text-field
      v-model.trim="form_inputs.empresa"
      :rules="empresaRules"
      label="Empresa:"
      required
    ></v-text-field>
  
    <v-text-field
      v-model.trim="form_inputs.campanha"
      :rules="campanhaRules"
      label="Nome da campanha:"
      required
    ></v-text-field>

    <v-select
      v-model="select"
      :items="form_inputs.items"
      :rules="[v => !!v || 'É preciso escolher um tipo de campanha!']"
      label="Tipo de campanha:"
      required
    ></v-select>
    
    <v-text-field
      v-model.trim="form_inputs.mlucro"
      :rules="mlucroRules"
      label="Margem de lucro mínima (%)"
      required
      type="number"
      :min="min" 
      :max="max"
    ></v-text-field>

    <datas @datechanged="getDate"/>
    
    <v-btn
      color="info"
      @click="reset"
    >
      Limpar informações
    </v-btn>
  </v-form>
</template>

<script>

  import datas from '../generalUseComponents/datas.vue'
 
  export default {
    props: ['send_form_data'],//flag para enviar os inputs preenchidos para o componente pai ( adicionar.vue)
    components: {
        datas
    },
    data: () => ({
      valid: true,//diz respeito aos inputs do form
      
      empresaRules: [
        v => !!v || 'É preciso entrar com o nome de uma empresa.',
      ],
      campanhaRules: [
        v => !!v || 'É preciso entrar com uma campanha.',
      ],
      min: 0,
      max: 100,
      mlucroRules: [
        v => !!v || 'É preciso entrar com uma margem de lucro mínima',
        v => (v >= 0 && v <= 100) || 'porcentagem tem que estar entre 0 e 100%'
      ],
      form_inputs: {
        empresa: '',
        campanha: '',
        items: [
          'campanha semanal',
          'campanha mensal'
        ],
        mlucro: '',
        data_inicio: '',
        data_termino: ''
      },
      select: null,
      checkbox: false
    }),
    methods: {
      getDate(data){//pega as datas formatas no componente filho 'datas'

        if(data.flag === 0)
          this.form_inputs.data_inicio = data.data
        else if(data.flag === 1)
          this.form_inputs.data_termino = data.data
        else
          console.log("erro ocorreu na funcao getData")    
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      }
    },
    watch: {
      valid: {
        handler(){
          if(!this.valid )//controla se o botao de 'proximo' no componente pai ficará habilitado ou nao
            this.$emit('statusform', this.valid)
          else 
            this.$emit('statusform',this.valid)
        }
      },
      send_form_data: {
        handler(){
          if(this.send_form_data){//envia os inputs preenchidos para o componente pai ( adicionar.vue)
            //console.log("enviarei os inputs ")
            this.$emit('getinputs',this.form_inputs)
          }  
        }
      }
    }
  }
</script>