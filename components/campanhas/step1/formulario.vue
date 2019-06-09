<template>

  <v-form
    ref="form"
    v-model="valid"
  > 
    <v-text-field
      v-model="form_inputs.empresa"
      :rules="empresaRules"
      label="Empresa:"
      required
    ></v-text-field>
  
    <v-text-field
      v-model="form_inputs.campanha"
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
      v-model="form_inputs.mlucro"
      :rules="mlucroRules"
      label="Margem de lucro mínima (%)"
      required
      type="number"
      :min="min" 
      :max="max"
    ></v-text-field>

    <datas @datachanged="getData"/>
    
    <v-btn
        :disabled="!valid"
        color="success"
        @click="validate"
      >
        Confirmar informações
    </v-btn>
    

    <v-btn
      color="info"
      @click="reset"
    >
      Limpar informações
    </v-btn>
  </v-form>
</template>

<script>
/*falta aparecer uma animacao qd o usuario validar as informacoes do formulario.
optei for fazer ele validar e só dps poder clicar em proximo, pois
assim garante que os inputs passados serao completos, em vez
de fragmentos ( sem o botao d confirmacao, corria o risco de
ser enviado informacoes antes do usuario terminar de digitar uma frase
ex: em vez de enviar 'coca-cola', eviaria 'coc' ou 'c' etc..) */
  import datas from './datas.vue'
 
  export default {
    
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
      getData(data){//pega as datas formatas no componente filho 'datas'

        if(data.flag === 0)
          this.form_inputs.data_inicio = data.data
        else if(data.flag === 1)
          this.form_inputs.data_termino = data.data
        else
          console.log("erro ocorreu na funcao getData")    
      },
      validate () {
        if (this.$refs.form.validate()) {
          this.$emit('statusform', {
            valid: this.valid,
            inputs: this.form_inputs
          })
        }
        else
          console.log("ainda n");
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
          if(!this.valid )
            this.$emit('statusform', this.valid)
        }
      }
    }
  }
</script>