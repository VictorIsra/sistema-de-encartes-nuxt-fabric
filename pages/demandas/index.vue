<template>
  <v-flex xl12>
    <v-toolbar flat color="white">
       <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Filtrar campanhas"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
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
      class="elevation-1"
      :search="search"
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
        <td class="text-xs-center">{{props.item.nome_empresa}}</td>
        <td class="text-xs-center">{{props.item.nome_campanha}}</td>
        <td class="text-xs-center">{{props.item.tipo_campanha}}</td>
        <td class="text-xs-center">{{props.item.marluc}}</td>
        <td class="text-xs-center">{{props.item.qtdade}}</td>
        <td class="text-xs-center">{{props.item.datas}}</td>
        <td class="text-xs-center" :class="{'green': props.item.status === 'aprovado', 'red':props.item.status === 'reprovado','yellow':props.item.status === 'em avaliação','light-blue lighten-4':props.item.status === 'enviado para tabloide' }">{{ props.item.status}}</td>


        <td class="justify-center layout px-0">
          <v-tooltip bottom v-if="props.item.status === 'reprovada '|| props.item.status === 'pendente'">
            <template v-slot:activator="{ on }"><!-- vai ser visivel só pro user diretor -->
              <!-- comprador só poderá editar uma campanha se ela tiver pendente ou foi reprovada ( reciclada)-->
              <v-icon 
                small
                @click="editItem(props.item)"
                v-on="on"
              >
                edit
              </v-icon>
            </template>
            <span class="subheading">Clique aqui para continuar a adicionar produtos a esta campanha</span>
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
            <span class="subheading">Clique aqui para excluir esta campanha</span>
          </v-tooltip> 
        </td>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
  import crudMixin from '../../components/mixins/CRUD.js'

  export default {
     mixins: [
      crudMixin
    ],
    data: () => ({
      search: '',
      dialog: false,
      headers: [
        { text: 'Empresa', value: 'nome_empresa',info:'nome da empresa'},
        { text: 'Nome da campanha', value: 'nome_campanha',info:'nome da campanha'},
        { text: 'Tipo de campanha', value: 'tipo_campanha',info:'tipo de campanha: mensal ou semanal'},
        { text: 'Margem de lucro', value: 'marluc',info:'margem de lúcro mínima'},
        { text: 'Quantidade de produtos', value: 'qtdade',info:'quantidade de produtos já cadastrados em uma dada campanha'},
        { text: 'Data da campanha', value: 'datas',info:'intervalo de datas onde a campanha irá acontecer'},
        { text: 'Status da campanha', value: 'status',info:"situação da campanha: pendente,aprovada,reprovada.Uma campanha recém criada ou que não atingiu a quantidade mínima de produtos estará numa situação 'pendente'. Uma campanha que bateu a meta de produtos e foi enviada para criação do tabloide estará no estado 'criação de tabloide'. Uma campanha que teve um tabloide criado e foi submetida a aprovação do diretor terá a situação 'em aprovação'. Uma campanha que foi reprovada pelo diretor estará na situação 'reprovada', e a que for aprovada estará em situação 'aprovada'."},
        { text: 'Ações', value: 'name', sortable: false ,info:'ações'}
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
      async fetchInfos(){//pega as info relativas as campanhas
        //pega info valiosas que nao aparecem na tabela. como o id da campanha por ex xD
        this.infos = await this.fetchCampanhas()
        this.infos.forEach(infos => 
        infos.datas = infos.data_i + ' até ' + infos.data_t )//sintetiza info das datas em um unico campo
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