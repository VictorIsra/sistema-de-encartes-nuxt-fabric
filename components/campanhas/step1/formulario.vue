<template>
  <v-form
    ref="form"
    v-model="valid"
  > 
    <v-flex  sm6>
      <v-text-field 
        v-model.trim="form_inputs.empresa"
        :rules="[empresaRules]"
        label="Empresa:"
        required
      ></v-text-field>
    </v-flex>
    <v-flex  sm6>

      <v-text-field
        v-model.trim="form_inputs.campanha"
        :rules="[campanhaRules]"
        label="Nome da campanha:"
        required
      ></v-text-field>
    </v-flex>

    <v-flex  sm6>
      <v-select
        v-model="form_inputs.tipos_campanhas"
        :items="tipos_campanhas"
        :rules="[v => !!v || 'É preciso escolher um tipo de campanha!']"
        label="Tipo de campanha:"
        required
      ></v-select>
    </v-flex>

    <v-flex sm6>
      <v-text-field
        v-model.trim="form_inputs.marluc"
        @blur="parseMlucro"
        :rules="[mlucroRules]"
        label="Margem de lucro mínima (%)"
        required
        suffix="%"
      ></v-text-field>
    </v-flex>
    
    <v-flex sm4>
      <v-text-field
        v-model.trim.number="form_inputs.qtdade"
        :rules="[qtdadeRules]"
        @blur="truncNumber"
        label="Quantidade mínima de produtos"
        required
      ></v-text-field>
    </v-flex>

    <v-flex sm6>
      <datas @datechanged="getDate"/>
    </v-flex>
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
      qtdadeRules(v){
        return (!!v && v > 0) || 'É preciso estabelecer uma quantidade mínima de produtos para a campanha.'
      },
      tipos_campanhas: [
        'campanha semanal',
        'campanha mensal'
      ],
      form_inputs: {
        empresa: '',
        campanha: '',
        tipos_campanhas: '', 
        marluc: '',
        data_inicio: '',
        data_termino: '',
        qtdade: '',//meta minima de produtos a serme cadastrados pra poder criar a campanha
        status:'pendente'
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
      parseMlucro(){
        this.form_inputs.marluc = this.parsePtBr(this.form_inputs.marluc)
      },
      truncNumber(){
        this.form_inputs.qtdade = Math.trunc(this.form_inputs.qtdade)
      }
    },
    watch: { 
      valid: {
        handler(){
          if(!this.valid )//controla se o botao de 'proximo' no componente pai ficará habilitado ou nao
            this.$emit('statusform', this.valid)
          else
            this.$emit('statusform',this.valid,this.form_inputs)
        }
      }
    }
  }
</script>