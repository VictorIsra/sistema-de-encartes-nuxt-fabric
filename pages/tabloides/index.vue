<template>
  <v-flex xl12>
     <v-toolbar flat color="grey lighten-4">
        <v-toolbar-title>
          <v-layout align-center class="mr-2 primary--text">
            <v-img class="mr-2" width="40" src="icones/tabloides.png"></v-img>
            Tablóides
          </v-layout>
        </v-toolbar-title>
         <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-card-title color="grey lighten-4" class="justify-center">
            <div>
                <h3 class="title font-weight-regular primary--text">Campanhas aptas a se montar um tablóide</h3>  
            </div>
        </v-card-title>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="infos"
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
        <td class="text-xs-center">{{props.item.nome_empresa}}</td>
        <td class="text-xs-center">{{props.item.nome_campanha}}</td>
        <td class="text-xs-center">{{props.item.tipo_campanha}}</td>
        <td class="text-xs-center">{{props.item.marluc}}</td>
        <td class="text-xs-center">{{props.item.qtdade}}</td>
        <td class="text-xs-center">{{props.item.datas}}</td>
        <td class="text-xs-center" :class="{'green': props.item.status === 'aprovado', 'red':props.item.status === 'reprovado','yellow':props.item.status === 'em avaliação','light-blue lighten-4':props.item.status === 'enviado para tabloide' }">{{ props.item.status}}</td>


        <td class="justify-center layout px-0">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }" v-if="1===1"><!-- vai ser visivel só pro user diretor -->
              <!-- comprador só poderá editar uma campanha se ela tiver pendente ou foi reprovada ( reciclada)-->
              <v-icon
                small
                class="mr-2"
                @click="editItem(props.item)"
                v-on="on"
              >
                edit
              </v-icon>
            </template>
            <span class="subheading">Clique aqui para montar um tablóide relativo a esta campanha</span>
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
      editedItem: {//precisa ter e será populado in time
      },
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
        this.$router.push({name: "tabloides-montar",params: {campanha_id:this.editedItem.campanha_id}}) 
      },
      async fetchInfos(){//pega as info relativas as campanhas
        const preInfos = await this.fetchCampanhas()
        this.filtraStatus(preInfos)
      },
      filtraStatus(infos){
        //só pega as campanhas que o status é diferente de 'pendente'
        this.infos = infos.filter(info => {return info.status !== 'pendente'})
        console.log("INFOS FILTARA ",this.infos)
        this.infos.forEach(infos => 
        infos.datas = infos.data_i + ' até ' + infos.data_t )//sintetiza info das datas em um unico campo
      },
    }
  }
</script>