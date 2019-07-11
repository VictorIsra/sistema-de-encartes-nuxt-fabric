<template>
  <div>
    <v-card>
      <v-card-title  primary-title class="justify-center">
        <div>
          <h3 class="title font-weight-regular primary--text">Informações dos usuários</h3>
        </div>      
      </v-card-title>
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
      
          <td class="justify-center layout px-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }" v-if="1===1"><!-- vai ser visivel só pro user diretor -->
                <v-icon
                  small
                  class="mr-2"
                  @click="editItem(props.item)"
                  v-on="on"
                >
                  edit
                </v-icon>
              </template>
              <span class="subheading">Clique aqui para alterar a senha e o tipo de usuário</span>
              </v-tooltip>  
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
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
        // name: '',
        // calories: 0,
        // fat: 0,
        // carbs: 0,
        // protein: 0
      },
      defaultItem: {
        // name: '',
        // calories: 0,
        // fat: 0,
        // carbs: 0,
        // protein: 0
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Opções de campanha:'
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
        //console.log("id: ", this.editedItem.campanha_id)
        //a principio redirecionará pra continuar a edicao/add de produtos, mas o diretor poderá alterar outras infos futuramente
        this.$router.push({name: "campanhas-adicionar",params: {campanha_id:this.editedItem.campanha_id,edited:true}})
        //só quero passar o id correspondente, a principio, n quero abrir o dialog, mas quem sabe o diretor o fará no futuro..entao deixo comentado
       // this.dialog = true
      },
      deleteItem (item) {
        const index = this.infos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        confirm('Tem certeza que deseja deletar essa campanha?') && ( this.infos.splice(index, 1) && this.removeCampanha(this.editedItem.campanha_id,this.editedItem.produtos))
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