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

            <v-list-tile
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
      </v-list>
    </v-navigation-drawer>

    <v-toolbar v-if="$store.state.auth.show_lateral_menu"
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
export default {

  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      user: '',
      items: [
        {
          icon: 'apps',
          title: 'Início',
          to: '/'
        },
        {divider: true},
        {
          icon: 'fa fa-bullhorn',
          title: 'Campanhas',
          to: '/campanhas'
        },
        {
          icon: 'record_voice_over',
          title: 'Demandas',
          to: '/demandas'
        },
        {
          icon: 'fas fa-table',
          title: 'Tablóides',
          to: '/tabloides'
        },
        {
          icon: 'fa fa-puzzle-piece',
          title: 'Produtos',
          to: '/produtos'
        },
        {divider: true},
        {
          icon: 'fas fa-users-cog',
          title: 'Usuários',
          to: '/admin'
        },
        {
          icon: 'fas fa-sign-out-alt',
          title: 'Sair',
          to: '/sair'
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
  },
  watch: {
    $route(to, from){
      this.miniVariant = true
      
     
      
      console.log("Olhando rota xD e status ", this.$store.state.auth.status)

      if(this.$store.state.auth.user !== null)
        console.log("tipo de user: ", this.$store.state.auth.user.userType)
      else
        console.log("Nul ainda")  
      this.defineColor(to.path)
    },
    '$store.state.auth.user': function(){
        console.log("eeeita")
    }            

  },

  created(){
    // if(window.innerWidth < 600){
    //   this.drawer = false
    // }else{
    //   this.drawer = true
    // }
    this.defineColor(this.$route.path)
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
