<template>
  <v-form
    ref="form"
    v-model="valid"
  > 
    <v-btn @click="teste" color="success">text</v-btn>

    <v-text-field
      v-model.trim="form_inputs.empresa"
      :rules="[empresaRules]"
      label="Empresa:"
      required
    ></v-text-field>
  
    <v-text-field
      v-model.trim="form_inputs.campanha"
      :rules="[campanhaRules]"
      label="Nome da campanha:"
      required
    ></v-text-field>

    <v-select
      v-model="form_inputs.tipos_campanhas"
      :items="tipos_campanhas"
      @blur="teste"
      :rules="[v => !!v || 'É preciso escolher um tipo de campanha!']"
      label="Tipo de campanha:"
      required
    ></v-select>
    
    <v-text-field
      v-model.trim="form_inputs.mlucro"
      @blur="parseMlucro"
      :rules="[mlucroRules]"
      label="Margem de lucro mínima (%)"
      required
      suffix="%"
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
  import formtInputMixin from '../../mixins/FormatInputMixin.js'

  export default {
    props: ['send_form_data'],//flag para enviar os inputs preenchidos para o componente pai ( adicionar.vue)
    components: {
        datas
    },
    mixins: [
      formtInputMixin
    ],
    data: () => ({
      valid: true,//diz respeito aos inputs do form
      empresaRules(v){
        v = v.trim(v)
        return !!v || 'É preciso entrar com o nome de uma empresa.'
      },
      campanhaRules(v){
        v = v.trim(v)
        return !!v || 'É preciso entrar com uma campanha.'
      },
      mlucroRules(v){
        v = v.trim(v)
        return !!v || 'É preciso entrar com uma margem de lucro mínima de pelo menos 0%'
      },
      tipos_campanhas: [
        'campanha semanal',
        'campanha mensal'
      ],
      form_inputs: {
        empresa: '',
        campanha: '',
        tipos_campanhas: '', 
        mlucro: '',
        data_inicio: '',
        data_termino: ''
      },
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
      },
      parseMlucro(){
        this.form_inputs.mlucro = this.parsePtBr(this.form_inputs.mlucro)
      },
      teste(){
      console.log(this.form_inputs)
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
            this.parseMlucro()
            this.$emit('getinputs',this.form_inputs)
          }  
        }
      }
    }
  }
</script>