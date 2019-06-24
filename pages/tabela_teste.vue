<!-- //arquivo igual ao componente tabelaProdutos.vue mas numa localizacao onde posso debuga-lo sem ter que repetir a etapa 1
-->

<template>
  <div>
    <v-btn color="success" @click="debug">ver se muda ordem</v-btn>
    <v-toolbar flat color="white"><!-- store direto pq no date n da p referenciar o this e tal, mais facil assim -->
    <span class="title font-weight-regular primary--text">Produtos cadastrados: {{itens.length}}/{{$store.state.campanhas.formInputs.qtdade}}</span>
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
          <v-btn color="primary" dark class="mb-2" @click="addItem(-1)" v-on="on" >Adicionar item</v-btn> <!--v-on="on" -->
        </template>
        <v-card > <!-- o form em si é esse v card! -->
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          
          <v-card-text v-model.lazy="valid" ref="editedItem"> <!-- informacoes de adicionar e deletar (é um form)-->
            <v-container grid-list-md >
              <v-layout wrap>
                 <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.nome"
                                @blur="editUserInputs(false)"
                                v-model.trim="editedItem.nome"
                                :rules="[nomeRule]" 
                                label="Produto">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.qtdade" 
                                :rules="[qtdadeRule]"
                                @blur="editUserInputs(false)"
                                v-model.trim="editedItem.qtdade"
                                label="Estoque">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field @blur="editUserInputs(false)" 
                                ref="editedItem.unidade"
                                v-model.trim="editedItem.unidade" 
                                label="Unidade"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.obs" v-model="editedItem.obs" label="Observação"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field  ref="editedItem.preco_c"
                                 min="1" step="any"
                                 @blur="editUserInputs(false)"
                                 v-model.trim="editedItem.preco_c" 
                                 :rules="[preco_cRule]" 
                                 label="Preço de compra"
                                 prefix="R$"
                                 >
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.preco_v"
                                @blur="editUserInputs(false)"
                                v-model.trim="editedItem.preco_v" 
                                min="1" step="any"
                                :rules="[preco_vRule]" 
                                prefix="R$"
                                label="Preço de venda">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.selout" v-model="editedItem.selout" label="Sell out"></v-text-field>
                </v-flex>
                <v-flex >
                  <v-text-field ref="editedItem.marluc" justify-center 
                                v-model.trim="editedItem.marluc" 
                                :rules="[marlucRule]"
                                 @blur="editUserInputs(false)"
                                suffix="%"
                                label="Margem de lucro"></v-text-field>
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
        <td class="text-xs-center">{{ props.item.nome }}</td>
        <td class="text-xs-center">{{ props.item.qtdade }}</td>
        <td class="text-xs-center">{{ props.item.unidade }}</td>
        <td class="text-xs-center">{{ props.item.obs }}</td>
        <td class="text-xs-center">{{ props.item.data_i }}</td>
        <td class="text-xs-center">{{ props.item.data_f }}</td>
        <td class="text-xs-center">{{ props.item.preco_c }}</td>
        <td class="text-xs-center">{{ props.item.preco_v }}</td>
        <td class="text-xs-center">{{ props.item.selout }}</td>
        <td class="text-xs-center">{{ props.item.marluc}}</td>

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
          <span>Clique aqui para editar esta linha da tabela</span>
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
          <span>Clique aqui para excluir esta linha da tabela</span>
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
  import imgUpload from '../components/campanhas/generalUseComponents/image_upload.vue'
  import datas from  '../components/campanhas/generalUseComponents/datas.vue'
  import formatInputMixin from '../components/mixins/FormatInputMixin.js'
  import imgMixin from '../components/mixins/ImgMixin.js'
  import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada

  export default {
    components: {
      'img-upload': imgUpload,
      datas
    },
    mixins: [
      formatInputMixin,
      imgMixin
    ],
    data: () => ({
      dialog: false,
      search: '',
      valid: true,
      metaProdutos: '',//qtdade minima de produtos na campanha
  
      headers: [
        
        { text: 'PRODUTO', value: 'nome' },
        { text: 'ESTOQUE', value: 'qtdade' },
        { text: 'UNIDADE', value: 'unidade' },
        { text: 'OBSERVAÇÃO', value: 'obs' },
        { text: 'DATA DE INÍCIO', value: 'data_i' },
        { text: 'DATA DE TÉRMINO', value: 'data_f' },
        { text: 'PREÇO DE COMPRA', value: 'preco_c' },
        { text: 'PREÇO DE VENDA', value: 'preco_v' },
        { text: 'SELL OUT', value: 'selout' },
        { text: 'MARGEM DE LUCRO', value: 'marluc' },  
        { text: 'AÇÕES', value: 'acao' } 
      ],
      itens: [],
      editedIndex: -1,
      editedItem: {
        img:  '',
        nome: '--',
        qtdade: '0.00',
        unidade: '--',
        obs: '--',
        data_i: '',
        data_f: '',
        preco_c: '0,00',
        preco_v: '0,00',
        selout: '',
        marluc: '0.00'
      },
      defaultItem: {//aqui seto os valores defaults
        img:  '',
        nome: '--',
        qtdade: '0.00',
        unidade: '--',
        obs: '--',
        data_i: '',
        data_f: '',
        preco_c: '0,00',
        preco_v: '0,00',
        selout: '',
        marluc: '0.00'
      }
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
      valid:{
        handler(){
          this.validate()
        }
      }
    },
    created () {
      this.initialize()//sera alimentado pelo bd eventualmente, tvz?
    },
    methods: {
      initialize () {
        this.itens = []
      },
      editItem (item) {
        this.editedIndex = this.itens.indexOf(item)
        this.editedItem = Object.assign({}, item)//copia os itens de uma linha para um novo objeto e o associa ao dialog de edicao ( dialog recebe o objeto copiado retornado)
        this.editUserInputs(false)
        this.dialog = true  
      },
      addItem(flag){
        console.log("chamo addItem xD")
      },
      deleteItem (item) {
        const index = this.itens.indexOf(item)
        confirm('Você tem certeza de que deseja remover este item?') && this.itens.splice(index, 1)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      criar(editedItem){
        api.campanha.criar(
              {produtos:editedItem}
        ).then(
              r => console.log("response: ",r)
        )
        .catch(e => console.log("erro: ",e))
      },
      save () {
        if (this.editedIndex > -1) {//na edicao, preciso editar antes do assign, se nao vou modificar uma copia q nao é mais usada
            this.editUserInputs()
            Object.assign(this.itens[this.editedIndex], this.editedItem)
            const keys = Object.keys(this.editedItem)
            console.log("keys: ",keys)
            console.log("salvei ja, itens edited: ", this.editedItem['marluc'])
            this.criar(this.editedItem)
           
        } else {//caso esteja adicionando algo em vez de editando
            this.itens.unshift(this.editedItem)//adicionar ao topo da lista, em vez de no final
            this.editUserInputs()
        }
        this.saveProdutos()
        this.close()      
      },
      saveProdutos(){
        this.$store.dispatch('campanhas/set_produtos',this.itens)//salva os valores da tabela globalmente
      },
      debug(){
        console.log("he")
        this.itens.forEach((it,i) => console.log("item ", it, " ind ",i))
      },
      validate(){
        const valid = []//verá quantos itens passarão no teste de validade ( excluindo datas, quem te validacao particular e diferenciada )
       
        //checando a validade dos campos obrigatórios que nao sejam datas    
        // Object.keys(this.editedItem).forEach((f,index) => {
        //   //if(index !== 0 && index !== 5 && index !== 6){//se n for data nem img, de boa usar o metodo validate
        //     valid.push(this.$refs["editedItem." + f.toString()].validate(true))                           // console.log("!this.editemItem[f]: ", !this.editedItem)//se n tiver nada prenchido
        //  // }
        // })
        if(valid.includes(false) ){//se os campos ou alguma data for inválida, invalide o form/dialog
         // console.log(" FORM invalido")
          this.valid = false
        }  
        else if(!valid.includes(false)){//caso contrário, valide
         // console.log(" Form valido!")
          this.valid  = true
        }  
      },
      //RULES:
      nomeRule(v){
          return !!v || "é preciso escolher um nome para o produto. "
      },
      qtdadeRule(v){
         return !!v || 'a quantidade é obrigatória'
      },
      preco_cRule(v){
        return  !!v || 'o preço de compra e é obrigatório'
      },
      preco_vRule(v){
        return !!v || 'o preço de venda e é obrigatório'
      },
      marlucRule(v){
        return !!v || 'a margem de lucro e é obrigatória'
      },
      editUserInputs(addUnit = true){//addUnit para botar o R$ e afins. quero isso pra salvar na tabela, mas nao quero isso ( addUnit = false) qd abrir uma form/dialog pra edicao
        this.editedItem.qtdade = this.parsePtBr(this.editedItem.qtdade)
        this.editedItem.preco_c = this.parsePtBr(this.editedItem.preco_c)
        this.editedItem.preco_v = this.parsePtBr(this.editedItem.preco_v)
        this.editedItem.marluc = this.parsePtBr(this.editedItem.marluc)

        if(addUnit){
          this.editedItem.preco_c = 'R$ ' + this.editedItem.preco_c
          this.editedItem.preco_v = 'R$ ' + this.editedItem.preco_v
          this.editedItem.marluc += '%'
        }
      },
      // debug(){
      //   console.log("ITEMS: ", this.itens)
      // }
    }
  }
</script>