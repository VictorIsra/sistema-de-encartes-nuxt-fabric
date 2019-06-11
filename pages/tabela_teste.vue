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
        <v-card > <!-- o form em si é esse v card! -->
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text> <!-- informacoes de adicionar e deletar-->
            <v-container grid-list-md >
              <v-layout wrap>
                 <v-flex >
                 <img-upload @imgUploaded="getImgInfo"/><!-- binds tao dentro do componente, ver isso melhor dps-->
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
                  <datas :checkDataRange="checkDataRange" @datachanged="getData"/>              <!--<v-text-field v-model="editedItem.data_i" label="Data de início"></v-text-field> -->
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
      <template v-slot:items="props"> <!-- {{ props.item.img }}-->
        <td class="text-xs-center">{{ props.item.img.url }}<img :src="props.item.img.img" width="50px" height="50px" alt=""></td>
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
      myimg: '',
      valid: true,
      image: '',
      formErrors: [],//data n pode ser fora do range, esse vetor controlará se o form podera ser salvo ou n, baseado nas datas
      dataRange: datas.methods.dataRange,
      checkDataRange: {
        checkRange: true,
        Pdata_i: '1/1/2018',//virá da etapa um 
        Pdata_f: '2/2/2019',
      },
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
   
    },

    methods: {
      initialize () {
        this.itens = [
          {
            img:  {
              img: '',
              url: 'hehe.jpg'
            },
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
          },
           {
            img:  {
              img: '',
              url: 'xd.jpg'
            },
            nome: 'feijao',
            qtdade: 1000,
            unidade: 'kg',
            obs: 'nada a declarar',
            data_i: '11/05/2019',
            data_f: '23/06/2019',
            preco_c: '1300',
            preco_v: '3033',
            selout: '--',
            marluc: '130%'
          }
         
        ]
      },

      editItem (item) {//esse objeto é preenchido no momento que o dialog de edicao é aberto
        
                  
        this.editedIndex = this.itens.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      
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
        console.log("coe ng coe")
        if(data.flag === 0)
            this.editedItem.data_i = data.data 
        else if(data.flag === 1)
            this.editedItem.data_f = data.data
        else
          console.log("erro ocorreu na funcao getData(componente datas.vue)")    
      },
      getImgInfo(data){
        //this.editedItem.img = data.file
        console.log("dados img", data.file)//savo no bd
         this.createImage(data.file);
      },
      createImage(file) {
        let image = new Image();
        var reader = new FileReader(); 
        reader.onload = (e) => {
          this.editedItem.img.img = e.target.result;
         // this.editedItem.img = e.target.result
        };
        reader.readAsDataURL(file);
        console.log("crie img")
      }
    }
  }
</script>