<template>
  <div>
    <v-toolbar flat color="white">
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
          <v-btn color="primary" dark class="mb-2" v-on="on">Adicionar item</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text> <!-- informacoes de adicionar e deletar-->
            <v-container grid-list-md >
              <v-layout wrap>
                 <v-flex >
                 <img-upload/><!-- binds tao dentro do componente, ver isso melhor dps-->
                </v-flex>
                 <v-flex xs12 sm6 md4>
                  <v-text-field  v-model="editedItem.nome" label="Produto"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.qtdade" label="Estoque"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.unidade" label="Unidade"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.obs" label="Observação"></v-text-field>
                </v-flex>
                <v-flex>
                  <datas :class="[dataInRange ? '': 'red']" @datachanged="getData"/>              <!--<v-text-field v-model="editedItem.data_i" label="Data de início"></v-text-field> -->
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  v-model="editedItem.preco_c" label="Preço de compra"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.preco_v" label="Preço de venda"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.selout" label="Sell out"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field justify-center v-model="editedItem.marluc" label="Margem de lucro"></v-text-field>
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
      <template v-slot:items="props">
       
        <td class="text-xs-center">{{ props.item.img }}</td>
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
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Resetar</v-btn>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          O produto "{{ search }}" não foi encontrado.
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>

  import imgUpload from './image_upload.vue'
  import datas from  '../components/campanhas/step1/datas.vue'

  export default {
    components: {
      'img-upload': imgUpload,
      datas
    },
    data: () => ({
      dialog: false,
      search: '',
      valid: true,
      dataRange: datas.methods.dataRange,
      dataInRange: true,
      headers: [
        
        { text: 'IMAGEM', value: 'img' },
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
        nome: '',
        qtdade: '',
        unidade: '',
        obs: '',
        data_i: '',
        data_f: '',
        preco_c: '',
        preco_v: '',
        selout: '',
        marluc: ''
      },
      defaultItem: {
        img:  '',
        nome: '',
        qtdade: '',
        unidade: '',
        obs: '',
        data_i: '',
        data_f: '',
        preco_c: '',
        preco_v: '',
        selout: '',
        marluc: ''
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
      }
    },

    created () {
      this.initialize()
      //this.dataRange('2/03/2014','2/09/2015','2/5/2014')
    },

    methods: {
      initialize () {
        this.itens = [
          {
            img:  'pqp.png',
            nome: 'Arroz',
            qtdade: 409,
            unidade: 'kg',
            obs: 'nada a declarar',
            data_i: '11/05/2019',
            data_f: '23/06/2019',
            preco_c: '130$',
            preco_v: '303$',
            selout: '--',
            marluc: '10%'
          }
         
        ]
      },

      editItem (item) {
        this.editedIndex = this.itens.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        console.log("item editado:", this.editedItem.data_i)
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

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.itens[this.editedIndex], this.editedItem)
        } else {
          this.itens.push(this.editedItem)
        }
              
        this.close()
      },
      getData(data){//pega as datas formatas no componente filho 'datas'
        //será chamado antes do método save, aqui, devo associar o valor do item editado com data
        //que assim ele atualizará na tabela no save ;)
        if(data.flag === 0){
          if(this.dataRange('11/11/2018','1/12/2019',data.data)){
            this.editedItem.data_i = data.data
            this.dataInRange = true
          }  
          else{
            this.editedItem.data_i = ''
            data.data = ''
            this.dataInRange = false//fica vermelho pra alertar que a data n bate ( solu noob q achei)
          }  
        }  
        else if(data.flag === 1){
          if(this.dataRange('11/11/2018','1/12/2019',data.data)){
            this.editedItem.data_f = data.data
            this.dataInRange = true
          }
          else{
            this.editedItem.data_i = ''
            data.data = ''
            this.dataInRange = false//fica vermelho pra alertar que a data n bate ( solu noob q achei)
          }  
        } 
        else{
          console.log("erro ocorreu na funcao getData(componente datas.vue)")  
        }    
      }
    }
  }
</script>