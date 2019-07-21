<!-- //arquivo igual ao componente tabelaProdutos.vue mas numa localizacao onde posso debuga-lo sem ter que repetir a etapa 1
-->
<template>
  <div>
    <v-toolbar flat color="white">
      <!-- aqui é uma prop passada pela etapa 2 (indiretamente, via o componente pai adicionar.vues) -->
    <span v-if="campanhaInfos && produtosQtdadeInfo !== undefined" class="title font-weight-regular primary--text">Produtos cadastrados: {{produtosQtdadeInfo.qtdade}}/{{produtosQtdadeInfo.meta}}</span>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Buscar produto"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
        </template>
        <v-card > <!-- o form em si é esse v card! -->
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          
          <v-card-text v-model.lazy="valid" ref="editedItem"> <!-- informacoes de adicionar e deletar (é um form)-->
            <v-container grid-list-md >
              <v-layout wrap>
                 <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.preco_v_c1"
                                @blur="editUserInputs(false)"
                                v-model.trim="editedItem.preco_v_c1" 
                                min="1" step="any"
                                :rules="[preco_vRule]" 
                                prefix="R$"
                                label="Preço de venda do concorrente 1:">
                  </v-text-field>
                </v-flex>
                 <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.preco_v_c2"
                                @blur="editUserInputs(false)"
                                v-model.trim="editedItem.preco_v_c2" 
                                min="1" step="any"
                                :rules="[preco_vRule]" 
                                prefix="R$"
                                label="Preço de venda do concorrente 2:">
                  </v-text-field>
                </v-flex>
                 <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.preco_v_c3"
                                @blur="editUserInputs(false)"
                                v-model.trim="editedItem.preco_v_c3" 
                                min="1" step="any"
                                :rules="[preco_vRule]" 
                                prefix="R$"
                                label="Preço de venda do concorrente 3:">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  color="primary" @click="close">Cancelar</v-btn>
            <v-btn  color="primary" :disabled="!valid"  @click="save">Salvar</v-btn>
           </v-card-actions>
          </v-card-text>

        </v-card>
      </v-dialog>
    </v-toolbar>
    <!-- campos que faram binds inportantes, como o search -->
    <v-data-table 
      :headers="headers"
      :items="itens"
      class="elevation-1"
      :search="search"
    > 
      <template v-slot:items="props"> <!-- {{ props.item.img }}-->
        <td class="text-xs-center"><img :src="getImgURL(props.item)" width="50px" height="50px" v-bind:alt="props.item.img.src"></td>
        <td class="text-xs-center">{{ props.item.nome }}</td>
        <td class="text-xs-center">{{ props.item.preco_c }}</td>
        <td class="text-xs-center">{{ props.item.preco_v }}</td>
        <td class="text-xs-center">{{ props.item.preco_v_c1 }}</td>
        <td class="text-xs-center">{{ props.item.preco_v_c2 }}</td>
        <td class="text-xs-center">{{ props.item.preco_v_c3 }}</td>
        <td class="text-xs-center" :class="{'green': parseFloat(props.item.marluc) >= parseFloat(campanhaInfos.marluc), 'red': parseFloat(props.item.marluc) < parseFloat(campanhaInfos.marluc)}">{{ props.item.marluc}}</td>

        <td class="justify-center layout px-0">
          <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
              v-on="on"
            >
              edit
            </v-icon>
          </template>
          <span>Clique aqui para editar os preços de venda da concorrência</span>
          </v-tooltip>

        </td>
      </template>
     <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Resetar</v-btn>
      </template>-->
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          O produto "{{ search }}" não foi encontrado.
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
//arquivo igual ao componente tabelaProdutos.vue mas numa localizacao onde posso debuga-lo sem ter que repetir a etapa 1
  
  import formatInputMixin from '../../mixins/FormatInputMixin.js'
  import crudMixin from '../../mixins/CRUD.js'


  export default {

    mixins: [
      formatInputMixin,
      crudMixin
    ],
    props:['flagC','campanha_id','campanhaInfos','produtosQtdadeInfo'],
    data: () => ({
      dialog: false,
      search: '',
      valid: true,

      headers: [
        
        { text: 'IMAGEM', value: 'img' , width: "1%", align: "center"},
        { text: 'PRODUTO', value: 'nome' , width: "1%", align: "center"},
        { text: 'PREÇO DE COMPRA', value: 'preco_c' , width: "1%", align: "center"},
        { text: 'PREÇO DE VENDA ', value: 'preco_v' , width: "1%", align: "center"},
        { text: 'PREÇO DE VENDA DO CONCORRENTE 1', value: 'preco_v_c1' , width: "1%", align: "center"},
        { text: 'PREÇO DE VENDA DO CONCORRENTE 2', value: 'preco_v_c2', width: "1%", align: "center"},
        { text: 'PREÇO DE VENDA DO CONCORRENTE 3', value: 'preco_v_c3' , width: "1%", align: "center"},
        { text: 'MARGEM DE LUCRO', value: 'marluc', width: "1%", align: "center"}, 
        { text: 'AÇÕES', value: 'acao' , width: "1%", align: "center"}
      ],
      itens: [],
      editedIndex: -1,
      editedItem: {
        // preco_v_c1: '0,00',
        // preco_v_c2: '0,00',
        // preco_v_c3: '0,00',
      },
      defaultItem: {//aqui seto os valores defaults
        // img:  '',
        // nome: '--',
        // preco_c: '0,00',
        // preco_v: '0,00',
        // preco_v_c1: '0,00',
        // preco_v_c2: '0,00',
        // preco_v_c3: '0,00',
        // marluc: '0.00'
      },
      cachedItens: []//itens relativos a concorrencia ficam nesse cache e sao concatenados ao itens ( pois itens aqui é alimentado parcialmente pela etapa 2)
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Item:' : 'Editando Item:'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      flagC:{//flag sera enviada qd eu clicar em 'prox' p etapa 3, daí alimentará os itens com o bd
        handler(){
          if(this.campanha_id !== undefined && this.campanha_id !== '-1')
            this.fetchProdutos()
          else
            console.log("escolhaprodutos.vue33 : nenhum id valido por hora ")  
        }
      }
    },
    methods: {
      async fetchProdutos(){
        //uso await this.getProdutos em vez de this.campanhaInfos.produtos pois o this.getProdutos pega os novos produtos em tempo real(nova query), assim, ficará atualizado caso eu passe da etapa 2 p 3, oq n seria o caso com o this.campanhaInfo.produtos, pois este é um 'print' do estado do produtos em um momento anterior
        this.itens = await this.getProdutos(this.campanha_id)
      },
      editItem (item) {
        this.editedIndex = this.itens.indexOf(item)
        this.editedItem = Object.assign({}, item)//copia os itens de uma linha para um novo objeto e o associa ao dialog de edicao ( dialog recebe o objeto copiado retornado)
        this.editUserInputs(false)
        this.dialog = true  
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {//na edicao, preciso editar antes do assign, se nao vou modificar uma copia q nao é mais usada
            this.editUserInputs(true)
            Object.assign(this.itens[this.editedIndex], this.editedItem)
            this.updateRow(this.editedItem,this.campanha_id)
        }    
        this.close()      
      },
      getImgURL(item){
        //se uma img nao tiver sido escolhida, retorne enm branco
        const path = item.img.name === undefined ? "" : "../../../uploads/fotos/" + item.img.name
        return path
      },
      validate(){
        const valid = []//verá quantos itens passarão no teste de validade
        //aqui tds os inputs precisam ser validas. sao poucos, sao só precos ref ao concorrente
       //melhorar ESSE ALGORITMO DPS URGENTEMENTE XD
        Object.keys(this.editedItem).forEach((f,index) => {
          console.log("F : ",f)
          //valid.push(this.$refs["editedItem." + f.toString()].validate(true))
        })
        if(valid.includes(false)){//se algum campo for falso, invalide o form/dialog
         // console.log(" FORM invalido")
          this.valid = false
        }  
        else if(!valid.includes(false)){//caso contrário, valide
         // console.log(" Form valido!")
          this.valid  = true
        }  
      },
      preco_vRule(v){
        return !!v || 'o preço de venda e é obrigatório'
      },
      editUserInputs(addUnit = true){//addUnit para botar o R$ e afins. quero isso pra salvar na tabela, mas nao quero isso ( addUnit = false) qd abrir uma form/dialog pra edicao
        this.editedItem.preco_v_c1 = this.parsePtBr(this.editedItem.preco_v_c1)
        this.editedItem.preco_v_c2 = this.parsePtBr(this.editedItem.preco_v_c2)
        this.editedItem.preco_v_c3 = this.parsePtBr(this.editedItem.preco_v_c3)

        if(addUnit){
          console.log("adiciono unidade")
          this.editedItem.preco_v_c1 = 'R$ ' + this.editedItem.preco_v_c1
          this.editedItem.preco_v_c2 = 'R$ ' + this.editedItem.preco_v_c2
          this.editedItem.preco_v_c3 = 'R$ ' + this.editedItem.preco_v_c3
        }
      },
    }
  }
</script>

<style>
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
  padding: 0px;
}
</style>