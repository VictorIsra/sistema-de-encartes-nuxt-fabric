<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card class="login-card elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Acessar sistema</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field prepend-icon="person" v-model="user" label="Usuário" type="text"></v-text-field>
          <v-text-field prepend-icon="lock" v-model="senha" label="Senha" id="password" type="password"></v-text-field>
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
    senha:''
  }),
  methods: {
    doLogin(){
      //this.$router.push('/')
        this.$store.dispatch('auth/login', {
         email: this.user,
          password: this.senha
        }).then(result => {
          // this.alert = {type: 'success', message: result.data.message}
          // this.loading = false
          this.$router.push('/')
        }).catch(error => {
        //this.loading = false
        console.log(error)
      })
    }
  }
}
</script>

<style lang="stylus">
.login-card
  width: 400px
</style>
