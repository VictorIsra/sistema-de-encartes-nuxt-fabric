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
            <v-btn @click='criar' color="info">
              <v-icon class="mr-2">flag</v-icon>
              <span>Criar nova campanha</span>
            </v-btn>
          </div>
        </v-fade-transition>
         <v-fade-transition hide-on-leave>
          <div v-if="!isFlag">
         <!-- <nuxt-link v-if="isMain" :to="{ path:'/campanhas/adicionar' ,query: {campanhaId:'1235' }}"> -->
            <v-btn @click='inicio' color="info">
              <!-- <v-icon class="mr-2">flag</v-icon> -->
              <span>Voltar para listagem de campanhas</span>
            </v-btn>
          </div>
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
    },

    methods: {
      criar(){
        this.isFlag = false
        this.$router.push('/campanhas/adicionar')
      },
      inicio(){
        this.isFlag = true
        this.$router.push('/campanhas')
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
