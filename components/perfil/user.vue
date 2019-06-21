<template>
  <div class="text-xs-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
    
        <template v-slot:activator="{ on }">
            <v-btn fab dark small color="primary" v-on="on">
                <v-avatar size="40px">
                    <img src="https://i.ytimg.com/vi/RyiikNewgX4/maxresdefault.jpg">
                </v-avatar>
            </v-btn>
        </template>
        

      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar size="50px">
              <img src="https://i.ytimg.com/vi/RyiikNewgX4/maxresdefault.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{user.userName}}</v-list-tile-title>
              <v-list-tile-sub-title>Tipo de usuário: {{user.userType}}</v-list-tile-sub-title>
            </v-list-tile-content>
            
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-tile
          >
            <v-tooltip bottom> 
                <template v-slot:activator="{ on }">
                    <div>
                        <v-btn round v-on="on" @click="logOut" color="primary">
                            <span>Sair/Logout</span>
                            <v-icon right>exit_to_app</v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>Sair/Logout</span>
            </v-tooltip> 
          </v-list-tile>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="menu = false">Fechar</v-btn>
        </v-card-actions>
      
      </v-card>

    </v-menu>
    
  </div>
  
</template>

<script>
  export default {
    data: () => ({
        fav: true,
        menu: false,
        message: false,
        hints: true,
        user: {
            useType: '',
            userName: ''
        }
     // user: $store.state.auth.userType
    }),
    mounted() {
        this.user.userType = this.$store.state.auth.userType
        this.user.userName = this.$store.state.auth.user.name
    },
    methods: {
        logOut () {
            this.$store.dispatch('auth/logout').then(() => {
            this.$router.push('/login')
            })
        }
    }
  }
</script>