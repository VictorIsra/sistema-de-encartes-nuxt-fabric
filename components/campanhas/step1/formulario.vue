<template>

  <v-form
    ref="form"
    v-model="valid"
    
  > 
  <v-btn @click="teste">text</v-btn>
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
      Validate
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

  import datas from './datas.vue'
 
  export default {
    
    components: {
        datas
    },
    data: () => ({
            
      valid: true,
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
      teste(){
       let xd = Object.values(this.form_inputs)
      
        console.log(xd)
       
      },
      getData(data){

        if(data.flag === 0)
          this.form_inputs.data_inicio = data.data
        else if(data.flag === 1)
          this.form_inputs.data_termino = data.data
        else
          console.log("erro ocorreu na funcao getData")    
        console.log('data ini ',this.form_inputs.data_inicio)
        console.log('data termi', this.form_inputs.data_termino)  
      },
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true
          this.teste();
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
    }
  }
</script>