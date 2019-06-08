<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  > 
    <v-text-field
      v-model="empresa"
      :rules="empresaRules"
      label="Empresa:"
      required
    ></v-text-field>
  
    <v-text-field
      v-model="campanha"
      :rules="campanhaRules"
      label="Nome da campanha:"
      required
    ></v-text-field>

    <v-select
      v-model="select"
      :items="items"
      :rules="[v => !!v || 'É preciso escolher um tipo de campanha!']"
      label="Tipo de campanha:"
      required
    ></v-select>
    
    <v-text-field
      v-model="mlucro"
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

  export default {
    
    components: {
        datas
    },
    data: () => ({
      valid: true,
      empresa: '',
      empresaRules: [
        v => !!v || 'É preciso entrar com o nome de uma empresa.',
      ],
      campanha: '',
      campanhaRules: [
        v => !!v || 'É preciso entrar com uma campanha.',
      ],
      mlucro: '',
      min: 0,
      max: 100,
      mlucroRules: [
        v => !!v || 'É preciso entrar com uma margem de lucro mínima',
        v => (v >= 0 && v <= 100) || 'porcentagem tem que estar entre 0 e 100%'
        /*gostaria mas n ta funcionando:
        (v,max,min) => (v >= this.min && v <= this.max) || 'porcentagem tem que
        estar entre 0 e 100% */
      ],
      select: null,
      items: [
        'Campanha semanal',
        'Campanha mensal',
        'Campanha anual',
        'Campanha motherfuckearll'
      ],
      checkbox: false
    }),

    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true
        }
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