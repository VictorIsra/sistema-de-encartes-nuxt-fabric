<template>
  <v-flex xl12>
     <v-toolbar flat color="grey lighten-4">
        <v-toolbar-title>
          <v-layout align-center class="mr-2 primary--text">
          <v-img class="mr-2" width="40" src="icones/gavel.png"></v-img>
            Análise das campanhas
          </v-layout>
        </v-toolbar-title>
         <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-card-title color="grey lighten-4" class="justify-center">
            <div>
                <h3 class="title font-weight-regular primary--text">Campanhas prontas para avaliação</h3>  
            </div>
        </v-card-title>
        <v-spacer></v-spacer>
         <v-layout class="justify-end">
          <v-layout align-center class="justify-end">
            <h3 class="subheading font-weight-regular primary--text">Criar mini demanda</h3>  
          </v-layout>  
          <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab dark color="primary" v-on="on" @click="addDemanda">
              <v-icon dark>add</v-icon>
            </v-btn>
           </template>
          <span class="subheading">Criar uma mini demanda</span>
          </v-tooltip>   
          </v-layout>
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
        <td class="text-xs-center" :class="{'green': props.item.status === 'aprovada', 'red':props.item.status === 'reprovada','yellow':props.item.status === 'em avaliação','light-blue lighten-4':props.item.status === 'enviado para tabloide' }">{{ props.item.status}}</td>

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
            <span class="subheading">Clique aqui para editar uma campanha ou criar uma demanda</span>
            </v-tooltip>  
        </td> 
         <td >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }"><!-- vai ser visivel só pro user diretor -->
              <!-- comprador só poderá editar uma campanha se ela tiver pendente ou foi reprovada ( reciclada)-->
              <v-icon
                medium
                v-on="on"
                color="primary"
                @click="verTabloide(props.item)"
              >
                visibility
              </v-icon>
            </template>
            <span class="subheading">Ver tablóide da campanha</span>
            </v-tooltip>  
        </td>   
        <td class="justify-end">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }"><!-- vai ser visivel só pro user diretor -->
              <!-- comprador só poderá editar uma campanha se ela tiver pendente ou foi reprovada ( reciclada)-->
              <v-icon
                medium
                v-on="on"
                color="success"
                @click="changeStatus('aprovada',props.item)"
              >
                thumb_up_alt
              </v-icon>
            </template>
            <span class="subheading">Aprovar campanha</span>
            </v-tooltip>  
        </td>
        <td>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }"><!-- vai ser visivel só pro user diretor -->
              <!-- comprador só poderá editar uma campanha se ela tiver pendente ou foi reprovada ( reciclada)-->
              <v-icon
                medium
                v-on="on"
                color="error"
                @click="changeStatus('reprovada',props.item)"

              >
                thumb_down_alt
              </v-icon>
            </template>
            <span class="subheading">Reprovar campanha</span>
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
        { text: 'Empresa', value: 'nome_empresa',info:'nome da empresa', width: "1%", align: "center"},
        { text: 'Nome da campanha', value: 'nome_campanha',info:'nome da campanha', width: "1%", align: "center"},
        { text: 'Tipo de campanha', value: 'tipo_campanha',info:'tipo de campanha: mensal ou semanal', width: "1%", align: "center"},
        { text: 'Margem de lucro', value: 'marluc',info:'margem de lúcro mínima', width: "1%", align: "center"},
        { text: 'Quantidade de produtos', value: 'qtdade',info:'quantidade de produtos já cadastrados em uma dada campanha', width: "1%", align: "center"},
        { text: 'Data da campanha', value: 'datas',info:'intervalo de datas onde a campanha irá acontecer', width: "1%", align: "center"},
        { text: 'Status da campanha', value: 'status',info:"situação da campanha: pendente,aprovada,reprovada.Uma campanha recém criada ou que não atingiu a quantidade mínima de produtos estará numa situação 'pendente'. Uma campanha que bateu a meta de produtos e foi enviada para criação do tabloide estará no estado 'criação de tabloide'. Uma campanha que teve um tabloide criado e foi submetida a aprovação do diretor terá a situação 'em aprovação'. Uma campanha que foi reprovada pelo diretor estará na situação 'reprovada', e a que for aprovada estará em situação 'aprovada'.", width: "1%", align: "center"},
        { text: 'Editar', value: 'name', sortable: false ,info:'Editar campanha', width: "1%", align: "center"},
        { text: 'Tabloide', value: 'name', sortable: false ,info:'Ver tablóide desta campanha', width: "1%", align: "center"},
        { text: 'Aprovar', sortable: false ,info:'aprovar campanha', width: "1%", align: "center"},
        { text: 'Reprovar', sortable: false ,info:'reprovar campanha', width: "1%", align: "center"},

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
      async changeStatus(status,item){//muda os status da campanha
        this.editedIndex = this.infos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem = await this.updateStatus(this.editedItem.campanha_id,status)
        this.editedItem.qtdade = this.editedItem.produtos.length + "/" + this.editedItem.qtdade
        Object.assign(this.infos[this.editedIndex], this.editedItem)

      },
      initialize () {
        this.fetchInfos()
      },
      addDemanda(){//flag canAdd vai controlar em ql momento posso adicionar demandas ou só ve-las
        this.$router.push({name: "demandas-demanda",params: {canAdd:true}}) 
      },
      editItem (item) {
        this.editedIndex = this.infos.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.$router.push({name: "analise-adicionar",params: {campanha_id:this.editedItem.campanha_id}}) 
      },
      verTabloide(item){
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
        this.infos = infos.filter(info => {return  info.status !== 'pendente' && info.status !== 'enviado para tabloide' && info.status !== 'produtos' && info.status !== 'backgrounds' && info.status !== 'complementares'})
        this.infos.forEach(infos => 
        infos.datas = infos.data_i + ' até ' + infos.data_t )//sintetiza info das datas em um unico campo
      },
    }
  }
</script>
<style>
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
  padding: 0px;
}
</style>
