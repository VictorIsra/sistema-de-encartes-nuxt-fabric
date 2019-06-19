<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">pag p texta os tokens/cookies e nuxtServerInit</v-card-title>
        <v-card-text>
          <p v-if="user">Colé, {{user.name}}</p>
          <p v-else>The user is not authenticated!</p>
          <v-btn color="success" @click="teste" >veajaa</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" flat @click="logOut">Logout</v-btn>
          <v-btn color="primary" flat nuxt to="/">pagprincipal</v-btn>
          <v-btn color="primary" flat @click="checkMe">ver se tá guardando info</v-btn>
        </v-card-actions>
        <p>status</p>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
    data: () => ({
  
    }),
    computed: {
        user () { return (this.$store.state.auth || {}).user || null }
    },
    methods:{
        logOut () {
            this.$store.dispatch('auth/logout').then(() => {
            this.$router.push('/')
            })
        }
        ,teste(){
            console.log("valor louco do store ", this.$store.state.auth)
        },
        checkMe () {
          this.$store.dispatch('auth/fetch').then(result => {
            console.log('Check Me Result:', result)
            console.log("vejamos ", this.$store.state.auth)
          })
      },   
    }
    
}
</script>