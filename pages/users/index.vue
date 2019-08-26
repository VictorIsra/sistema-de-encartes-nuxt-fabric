<template>
  <div>
    <v-card>
     <v-toolbar flat color="grey lighten-4">
        <v-toolbar-title>
          <v-layout align-center class="mr-2 primary--text">
            <v-img class="mr-2" width="50" src="../icones/usuarios.png"></v-img>
            Usuários
          </v-layout>
        </v-toolbar-title>
         <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
    </v-toolbar>
      <v-divider class="title font-weight-regular primary--text"></v-divider>
      <v-toolbar flat color="white">
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filtrar informações dos usuários"
          single-line
          hide-details
        ></v-text-field>
        
        <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-layout align-center class="justify-end">
                <h3 class="subheading font-weight-regular primary--text">Cadastrar novo usuário</h3>  
              </v-layout>  
              <v-btn to="/users/adicionar" fab dark color="primary" v-on="on">
                <v-icon dark>add</v-icon>
              </v-btn>
            </template>
          <span class="subheading">Cadastrar novo usuário</span>
          </v-tooltip>  
        <v-dialog v-model="dialog" max-width="500px">

          <v-card>  
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Fechar</v-btn>
              <v-btn color="blue darken-1" flat @click="save">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="infos"
        :search="search"
        class="elevation-1"
      >
      <template slot="headerCell" slot-scope="props">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">
              {{ props.header.text }}
            </span>
          </template>
          <span class="subheading">
            {{ props.header.info }}
          </span>
        </v-tooltip>
      </template>
      <!-- indica o conteudo da linhas -->
        <template v-slot:items="props">
          <td class="text-xs-center">{{props.item.name}}</td>
          <td class="text-xs-center">{{props.item.email}}</td>
          <td class="text-xs-center">{{props.item.empresa}}</td>
          <td class="text-xs-center">{{props.item.login}}</td>
          <td class="text-xs-center">{{props.item.userType}}</td>
      
          <td class="text-xs-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <!-- usuario padrao nao pode ser deletado, ele é o root xD -->
                <v-icon
                  v-if="props.item._id !== '5d5b00b375885d1e18bd4df7'"
                  small
                  @click="deleteItem(props.item)"
                  v-on="on"
                >
                  delete
                </v-icon>
              </template>
              <span class="subheading">Clique aqui para excluir este usuário</span>
              </v-tooltip> 
          </td>
        </template>
      </v-data-table>
    </v-card>  
  </div>
</template>

<script>
  import userMixin from '../../components/mixins/userCRUD.js'

  export default {
     mixins:[
      userMixin
    ],
    data: () => ({
      search: '',
      dialog: false,
      headers: [
        { text: 'Nome', value: 'name',info:'Nome da pessoa associada ao usuário',align: 'center'},
        { text: 'E-mail', value: 'email',info:'E-mail da pessoa associada ao usuário',align: 'center'},
        { text: 'Empresa', value: 'empresa',info:'Empresa da pessoa associada ao usuário',align: 'center'},
        { text: 'Usuário', value: 'login',info:'Nome do usuário/login',align: 'center'},
        { text: 'Tipo de usuário', value: 'userType',info:'Tipo de usuário: administrador,tablóide,comprador,diretor',align: 'center'},
        { text: 'Ações', value: 'name', sortable: false ,info:'ações',align: 'center'}
      ],
      infos: [],//sao as informacoes relativas a uma campanha
      editedIndex: -1,
      editedItem: {

      },
      defaultItem: {

      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Editando usuário'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.fetchInfos()
      },
      editItem (item) {
        this.editedIndex = this.infos.indexOf(item)
        this.editedItem = Object.assign({}, item)
       
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.infos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        console.log("ID ", this.editedItem._id)
        confirm('Tem certeza que deseja deletar esse usuário?') && ( this.infos.splice(index, 1) && this.removeUser(this.editedItem._id))
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      async fetchInfos(){//pega as info relativas aos users
        this.infos = await this.fetchAll()
        console.log("infos ", this.infos)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.infos[this.editedIndex], this.editedItem)
        } else {
          this.infos.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>