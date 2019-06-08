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
        'datas': datas
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