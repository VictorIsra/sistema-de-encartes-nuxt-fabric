<template>
  <div>
    <div class="elevation-1 ">
      <v-toolbar flat color="grey lighten-4">
        <v-toolbar-title>
          <v-layout align-center class="mr-2">
            <v-img class="mr-2" width="40" src="icones/campanhas2.0.png"></v-img>
            Campanhas
          </v-layout>
        </v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <span class="title-text grey--text">{{currentText}}</span>
        <v-spacer></v-spacer>
        <v-fade-transition hide-on-leave>
          <div v-if="isFlag">
         <!-- <nuxt-link v-if="isMain" :to="{ path:'/campanhas/adicionar' ,query: {campanhaId:'1235' }}"> -->
            <v-btn @click='teste' color="info">
              <v-icon class="mr-2">flag</v-icon>
              <span>Criar nova campanha</span>
            </v-btn>
          </div>  
         <!-- </nuxt-link> -->
        </v-fade-transition>
        <v-fade-transition hide-on-leave>
        <!--   <nuxt-link v-if="!isMain" to="/campanhas"> -->
         <!-- <div v-if='1>2'>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" round class="red lighten-4"
                  @click="$store.dispatch('campanhas/reset_campanha')">
                  <v-icon class="mr-2" color="red">cancel</v-icon>
                  <span class="red--text">Abandonar campanha</span>
                </v-btn>
              </template>
              <span>Clique aqui se desistiu dessa campanha e deseja criar outra.</span>
            </v-tooltip>
          </div>  -->
       <!--   </nuxt-link> -->
        </v-fade-transition>
        
      </v-toolbar>
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
  export default {
    data: ()=> ({
      isMain: true,
      isAdding: false,
      isEditing: false,
      isFlag: true
    }),

    watch: {
      $route(to, from){
        this.checkRoute()
      }
    },

    created(){
      this.checkRoute()
      console.log("checando ", this.$route.path)
    },

    methods: {
      teste(){
        this.isFlag = false
        this.$router.push('/campanhas/adicionar')
      },
      checkRoute(){
        if(this.$route.path.includes('adicionar')){
          this.isMain = false
          this.isAdding = true
          this.isFlag = false
        }
        else if(this.$route.path.includes('editar')){
          this.isMain = false
          this.isEditing = true
          this.isFlag = false
        }
        else{
          console.log("caso elsse")
          this.isMain = true
          this.isFlag = true
          this.isAdding = false
          this.isEditing = false
        }
      }
    },

    computed: {
      currentText(){
        if(this.isAdding){
                    console.log("entroo2")

          return 'Adicionando nova campanha'
        }

        if(this.isEditing){
          console.log("entroo")
          return 'Editando campanha'
        }

        return 'Listando campanhas'
      }
    }
  }
</script>

<style lang="stylus">
.title-text
  font-size: 16px !important
</style>
