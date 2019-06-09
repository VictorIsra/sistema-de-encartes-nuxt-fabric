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

    <datas/>
    
  
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
  import data_t from './data_t.vue'

  export default {
    
    components: {
        datas
    },
    data: () => ({
      
      //lembre que retorna uma F, logo só acessarei os atributos após invoca-la
      datasData: datas.data,
      valid: true,
      //empresa: '',
      empresaRules: [
        v => !!v || 'É preciso entrar com o nome de uma empresa.',
      ],
     // campanha: '',
      campanhaRules: [
        v => !!v || 'É preciso entrar com uma campanha.',
      ],
     // mlucro: '',
      min: 0,
      max: 100,
      mlucroRules: [
        v => !!v || 'É preciso entrar com uma margem de lucro mínima',
        v => (v >= 0 && v <= 100) || 'porcentagem tem que estar entre 0 e 100%'
        /*gostaria mas n ta funcionando:
        (v,max,min) => (v >= this.min && v <= this.max) || 'porcentagem tem que
        estar entre 0 e 100% */
      ],
      dateFormatted_inicio: '',
      dateFormatted_termino:'',
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
      // items: [
      //   'Campanha semanal',
      //   'Campanha mensal',
      //   'Campanha anual',
      //   'Campanha motherfuckearll'
      // ],
      checkbox: false
    }),

    methods: {
      teste(){

        console.log("datas data xD: ", this.datasData)
        // let testando = this.datasData()
        // console.log("testandp: ", testando.nome)
        // console.log("inputsd o form:\n ");
        // let x = this.datasData()
        // console.log("x é ", x.data_termino)
       // this.form_inputs.data_inicio = this.datasData().data_inicio
        // Object.values(this.form_inputs).forEach(v =>
        // {
        //   console.log("valor: ", v);
        // })
       
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