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
import userCRUD  from '~/components/mixins/userCRUD.js'

export default {
  layout: 'login',

  components: {
    Logo,
    VuetifyLogo
  },
  mixins: [userCRUD],
  data: () => ({
    user:'',
    senha:'',
    erroStatus: false,
    showPws: false,
  }),
  created () {
    this.checkRoot()//cria o user root se nao existir.
  },  
  methods: {
    doLogin(){
        this.$store.dispatch('auth/login', {
         user: this.user,
          password: this.senha
        }).then(result => {
          if(!result)//se result for undefined
            throw new Error()//vai pro catch, importantissimo se nao ele iria redirecionar anyway
         // console.log("resultadO : ", result.data)//aqui que retorna bags maneiros!!, o result em si é perigoso, retorna senha em plaintext e tal
          this.$store.dispatch('auth/set_user_type',result.data.user.userType)//chamo isso no nuxtServerInit tb, mas inicialmente chamo aqui
          this.$router.push('/')
        }).catch(error => {
        //this.loading = false
        this.erroStatus = true
      })
    },
    async checkRoot(){//se o user root n existir, crie-o
      
      const existeUserRoot = await this.checkRootUser()
      //console.log("E AI: ",existeUserRoot)
      if(!existeUserRoot){
      //  console.log("IREI CRIAR")
        await this.registrar({
          userType: "admin",
          name: "root",
          login: "root",
          email: "root@gmail.com",
          empresa: "--",
          password: "toor123456"
        })
      }
    }
  }
}
</script>

<style lang="stylus">
.login-card
  width: 400px
</style>
