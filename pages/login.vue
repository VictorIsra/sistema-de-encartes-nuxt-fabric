<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card class="login-card elevation-12">
      <v-toolbar dark color="primary">
  
        <v-toolbar-title >Acesso ao sistema</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
           <v-alert
            :value="erroStatus"
            type="error"
          > usuário ou senha inválidos </v-alert>
          <v-text-field  prepend-icon="person" v-model="user" label="Usuário" type="text"></v-text-field>
          <v-text-field  :append-icon="showPws ? 'visibility' : 'visibility_off'"
                         prepend-icon="lock" v-model="senha" label="Senha"
                         @click:append="showPws = ! showPws"
                         :type="showPws ? 'text' : 'password'"
                         id="password"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="doLogin">Entrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  layout: 'login',

  components: {
    Logo,
    VuetifyLogo
  },
  data: () => ({
    user:'',
    senha:'',
    erroStatus: false,
    showPws: false,
  }),
  methods: {
    doLogin(){
        this.$store.dispatch('auth/login', {
         user: this.user,
          password: this.senha
        }).then(result => {
          if(!result)//se result for undefined
            throw new Error()//vai pro catch, importantissimo se nao ele iria redirecionar anyway
          console.log("resultadO : ", result.data)//aqui que retorna bags maneiros!!, o result em si é perigoso, retorna senha em plaintext e tal
        // console.log("tipo de user ", $store.state.auth.user)
        
          this.$router.push('/')
        }).catch(error => {
        //this.loading = false
        this.erroStatus = true
      })
    },
    logInRules(){
      
    }
  }
}
</script>

<style lang="stylus">
.login-card
  width: 400px
</style>
