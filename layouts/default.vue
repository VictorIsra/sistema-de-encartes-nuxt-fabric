<template>
  <v-app>
    <v-navigation-drawer v-if="$store.state.auth.show_lateral_menu"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
      :mobile-break-point="600"
      class="box-shadow"
    >
      <v-list>
        <v-tooltip :close-delay="0" :open-delay="0" v-for="(item, i) in items" :key="i" right>
          <template v-slot:activator="{ on }">
            
            <v-list-tile v-if="item.showMe"
              :class="{'auto-height': item.divider}"
              :to="item.to"
              v-on="(miniVariant == false) ? {} : on"
              router
              exact
            > 
              <v-divider class="my-1 pa-0" v-if="item.divider"></v-divider>
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title" />
              </v-list-tile-content>
            </v-list-tile>
          </template>
          <span>{{item.title}}</span>
        </v-tooltip>
        <div class="text-xs-center">
          <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn @click="logOut" icon v-on="on" >
              <v-icon color="blue-grey darken-1">fas fa-sign-out-alt</v-icon>
            </v-btn> 
            </template>
            <span>Sair/Logout</span>
          </v-tooltip>
        </div>  
      </v-list>
    </v-navigation-drawer>

    <v-toolbar  v-if="$store.state.auth.show_lateral_menu"
      :clipped-left="true"
      fixed
      app
      dense
      
      :color="color.value"
      :dark="color.dark"
      
    >
        <v-btn
          icon
          @click.stop="changeVariant"
        >
          <v-fade-transition leave-absolute>
            <v-icon v-if="miniVariant == true || drawer == false">menu</v-icon>
          </v-fade-transition>
          <v-fade-transition leave-absolute>
            <v-icon v-if="miniVariant == false && drawer == true">arrow_back</v-icon>
          </v-fade-transition>
        </v-btn>
        
      <nuxt-link to="/">
        <v-toolbar-title class="white--text" v-text="title" />
      </nuxt-link>
      
      <v-spacer />
      <v-btn
        icon
        v-if="false"
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>menu</v-icon>
      </v-btn>
        <v-container fill-height>
          <v-flex class="text-xs-center">
            <span>Bem vindo {{userName}}, tenha um ótimo de dia de trabalho!</span>
          </v-flex>  
        </v-container>
        <!-- trecho com avat + nome do user..ate podia ser um compoennte aparte mas n tem pq xD -->
        <v-layout justify-center fill-height>
          <v-divider  vertical
                      class="white"
          ></v-divider>
        </v-layout>
        <user-profile/>
        <span class="white--text font-weight-light">{{ userName }}</span>
    
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    
  </v-app>
</template>

<script>
import userProfile from '../components/perfil/user'
export default {
  
  components: {
    'user-profile':userProfile
  },
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      user: '',
      userName: '',
      items: [
        {
          icon: 'apps',
          title: 'Início',
          to: '/',
          showMe: true
        },
        {divider: true},
        {
          icon: 'fa fa-bullhorn',
          title: 'Campanhas',
          to: '/campanhas',
          showMe: true
        },
        {
          icon: 'record_voice_over',
          title: 'Demandas',
          to: '/demandas',
          showMe: true
        },
        {
          icon: 'fa-table',//Analisar campanhas fas fa-table
          title: 'Tablóides',
          to: '/tabloides',
          showMe: true
        },
        {
          icon: 'shopping_cart',
          title: 'Produtos',
          to: '/produtos',
          showMe: true
        },
        {divider: true},
        {
          icon: 'fas fa-users-cog',
          title: 'Usuários',
          to: '/admin',
          showMe: true
        },
         {
          icon: 'gavel',
          title: 'Analisar campanhas',
          to: '/analise',
          showMe: true
        },
        
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'encarteDO!',
      color: {
        value: 'blue darken-2',
        dark: true
      }
    }
  },/*<v-btn  icon>
              <v-icon>fas fa-sign-out-alt</v-icon>
            </v-btn>  */
  watch: {
    $route(to, from){
      this.miniVariant = true
      this.defineColor(to.path)
    }
    
  },

  created(){
    this.defineColor(this.$route.path)
  },
  mounted(){
    this.userName = this.$store.state.auth.user.name
    this.getUserType()
  },
  methods: {
    
    changeVariant(){
      if(window.innerWidth < 600){
        this.miniVariant = false
        this.drawer = true
      }else{
        this.miniVariant = !this.miniVariant
      }
    },
    logOut () {
      console.log("teste")
      this.$store.dispatch('auth/logout').then(() => {
        console.log("logout realizado")
        this.$router.push('/login')
      })
    },
    getUserType(){
      //dependendo do tipo de usuario mostrará/escondera um item
      console.log("tipo de user: ", this.$store.state.auth.userType, " <--")
      this.user = this.$store.state.auth.userType
      this.items.forEach(it => {
        if(it.title){//pois  divider e afins sao aprte da lista, mas só to itneressado nos itens, e otdo item tem um title
          if(this.user === 'comprador'){
            if( it.title === 'Início')
              it.showMe = true
            else if( it.title === 'Demandas')
              it.showMe = true
            else if(it.title === 'Campanhas')
              it.showMe = true
            else if(it.title === 'Tablóides')    
              it.showMe = true    
            else
              it.showMe = false
          }
          else if(this.user === 'diretor'){
            if( it.title === 'Início')
              it.showMe = true
            else if( it.title === 'Demandas')
              it.showMe = true
            else if( it.title === 'Produtos')
              it.showMe = true
            else if(it.title == 'Analisar campanhas')    
              it.showMe = true
            else
              it.showMe = false 
          }
          else if(this.user === 'tabloide'){
            if( it.title === 'Início')
              it.showMe = true
            else if( it.title === 'Produtos')
              it.showMe = true
            else if(it.title === 'Tablóides')    
              it.showMe = true
            else
              it.showMe = false 
          }
          //user admin é deus e pode tudo
        }
      })
    },
    defineColor(path){
      console.log(path)
      if(path.includes('campanhas')){
        this.color = {
          value: 'blue darken-2',
          dark: true
        }
      }
      else if(path.includes('tabloides')){
        this.color = {
          value: 'blue darken-2',
          dark: true
        }
      }
      else if(path.includes('produtos')){
        this.color = {
          value: 'blue darken-2',
          dark: true
        }
      }
      else if(path.includes('usuarios')){
        this.color = {
          value: 'blue darken-2',
          dark: true
        }
      }
      else {
        this.color = {
          value: 'blue darken-2',
          dark: true
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.box-shadow
  box-shadow: 0px 5px 15px rgba(0,36,79,0.1) !important;
.auto-height
  div
    height: auto !important
</style>
