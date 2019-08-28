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
                    <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png">
                </v-avatar>
            </v-btn>
        </template>
        
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar size="50px">
              <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png">
            </v-list-tile-avatar>
            <v-spacer></v-spacer>
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
                        <v-btn fab dark small color="primary" v-on="on" @click="logOut" >
                          <v-icon dark>exit_to_app</v-icon>
                        </v-btn>
                        <span>sair/logout</span>
                    </div>
                </template>
                <span>Sair/Logout</span>
            </v-tooltip> 
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile
          >
            <v-tooltip bottom> 
                <template v-slot:activator="{ on }">
                    <div>
                        <v-btn fab dark small color="primary" v-on="on" @click="menu = false" >
                          <v-icon dark>close</v-icon>
                        </v-btn>
                        <span>Fechar</span>
                    </div>
                </template>
                <span>Fechar</span>
            </v-tooltip> 
          </v-list-tile>
        </v-list>

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