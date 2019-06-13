<!-- //arquivo igual ao componente tabelaProdutos.vue mas numa localizacao onde posso debuga-lo sem ter que repetir a etapa 1
-->
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
          <v-btn color="primary" dark class="mb-2" @click="sendDefaultDates(-1)" v-on="on" >Adicionar item</v-btn> <!--v-on="on" -->
        </template>
        <v-card > <!-- o form em si é esse v card! -->
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text> <!-- informacoes de adicionar e deletar-->
            <v-container grid-list-md >
              <v-layout wrap>
                 <v-flex >
                 <img-upload :imgInfo="imgInfo" @imgUploaded="fillCachedImgInfo"/><!-- binds tao dentro do componente, ver isso melhor dps-->
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
                  <datas :checkDataRange="checkDataRange" @datechanged="getDate" :defaultDatesValues="defaultDatesValues"/>              <!--<v-text-field v-model="editedItem.data_i" label="Data de início"></v-text-field> -->
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
        <td class="text-xs-center"><img :src="props.item.img.src" width="50px" height="50px" alt=""></td>
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
//arquivo igual ao componente tabelaProdutos.vue mas numa localizacao onde posso debuga-lo sem ter que repetir a etapa 1
  import imgUpload from '../generalUseComponents/image_upload.vue'
  import datas from  '../generalUseComponents/datas.vue'
  
  export default {
    components: {
      'img-upload': imgUpload,
      datas
    },
  
    data: () => ({
      dialog: false,
      //addItemFlag: 1,
      search: '',
      valid: true,
      formErrors: [],//data n pode ser fora do range, esse vetor controlará se o form podera ser salvo ou n, baseado nas datas
      //info relativas a validacao do range de datas. v
      //dataRange: datas.methods.dataRange,
      //PROPS (lembrar que, na verdade, são props para um componente filho
        checkDataRange: {
          checkRange: true,
          Pdata_i: '1/1/2018',//virá da etapa um 
          Pdata_f: '2/2/2019'
        },
        //fim de info relativa a validacao de datas.^
        defaultDatesValues: {//valor das datas em uma linha em particular da tabela. É uma prop
          Rdata_i: '', //de 'row data inicio'
          Rdata_f: '',
          flag: 0
        },
        //prop que indicará pro componente filho (image_upload) as img que devem ser mostradas qd um dialog/form abrir
        imgInfo: {
          imgName: '',
          imgURL: '',
          imgFile: '',
          flag: 0
        },
      //FIM DAS PROPS ^  

      //info relativas ao upload de img.v
      // Faco um cache em vez de assimilar a variavel 'itens'
      //diretamente pois só quero associa-la se o usuário salvar as alterações, se não, nao. :)
      cachedImgInfo: {
        imgName: '',//só o nome da img
        imgFile: '',//objeto que pode ser salvo no db e posteriormente renderizado em uma img,inclusive
        imgURL: ''
      },
      //fim info relativas ao uplode e img ^
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
      this.initialize()//sera alimentado pelo bd eventualmente, tvz?
    },

    methods: {
      initialize () {
  
        this.itens = [
          {
            img:  {
              src: '',
              name: 'hehe.jpg',
              url: ''
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
              src: '',
              name: 'xd.jpg',
              url: ''
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
      prepareImgInfo(currentItem){//envia pro componente filho image_uload.vue os valores ( sao props no comp filho) a serem colocados ao abrir a aba/form de edit
        this.imgInfo.imgFile = currentItem.img.src
        this.imgInfo.imgURL = currentItem.img.url
        this.imgInfo.imgName = currentItem.img.name
        this.imgInfo.flag = 1
      },
  
      editItem (item) {
        this.editedIndex = this.itens.indexOf(item)
        this.editedItem = Object.assign({}, item)//copia os itens de uma linha para um novo objeto e o associa ao dialog de edicao ( dialog recebe o objeto copiado retornado)
        this.sendDefaultDates(1)//pro componente filho mostrar as datas referentes a linha ao abrir o dialog
        this.prepareImgInfo(this.editedItem)
        this.dialog = true  
      },

      deleteItem (item) {
        const index = this.itens.indexOf(item)
        confirm('Você tem certeza de que deseja remover este item?') && this.itens.splice(index, 1)
      },
    
      close () {
        this.resetFlags()
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      resetFlags(){//reseta as flags que sao props em componentes filhos, pra que o watch sempre observe mudanca
        this.defaultDatesValues.flag = 0
        this.imgInfo.flag = 0
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.itens[this.editedIndex], this.editedItem)
          this.fillImgInfo()
        } else {//caso esteja adicionando algo em vez de editando
          this.itens.push(this.editedItem)
          this.fillImgInfo(this.itens.length -1)
        }
        this.close()
      },
      getDate(data){//pega as datas formatas no componente filho 'datas'
        //será chamado antes do método save, aqui, devo associar o valor do item editado com data
        //que assim ele atualizará na tabela no save ;)
        if(data.flag === 0)
            this.editedItem.data_i = data.data 
        else if(data.flag === 1)
            this.editedItem.data_f = data.data
        else
          console.log("erro ocorreu na funcao getData(componente datas.vue)")    
      },
      sendDefaultDates(flag){//dps passarei 1 ou 0 como argumento, pra dif edicao de um item novo
        //se flag == 1, irá fazer as dates no componente data.vue passarem o valor presente na linha atual da tabela 
        //se flag == 0, é o valor default, das datas ficarem em branco qd abrir um form/dialogo
        //flag == -1, msm comportamento do default, mas garante q será executado, pois as flags sao baseados em watch no componente filho
        this.defaultDatesValues.flag = flag
        this.defaultDatesValues.Rdata_i = this.editedItem.data_i
        this.defaultDatesValues.Rdata_f = this.editedItem.data_f
      },
      fillCachedImgInfo(data){//componente filho img-upload enviará um evento e esta f será triggada por este evento
        //cacheio esses resultados e só associo a variavel 'itens' qd o usuario quiser salvar de fato a img
        this.cachedImgInfo.imgName = data.name
        this.cachedImgInfo.imgFile = data.file
        this.cachedImgInfo.imgURL = data.url
      },
      fillImgInfo(newItemIndex = ''){   
         //só guardarei a foto escolhida se ele salvou algo, se nao, nao
        //sera chamada se o user de fato quis salvar uma img e ela nao for em branco, pois caso seja, n tem objeto pra criar e daria erro!
        if(this.cachedImgInfo.imgFile !== '' && newItemIndex === ''){//caso editando algo existente c img
          this.createImage(this.cachedImgInfo.imgFile,this.editedItem)
          this.editedItem.img.name = this.cachedImgInfo.imgName
          this.editedItem.img.url = this.cachedImgInfo.imgURL         
        }
        else if(this.cachedImgInfo.imgFile !== '' && newItemIndex !== ''){//caso criando algo novo  que contenha img
          this.itens[newItemIndex].img = {
            src:  this.cachedImgInfo.imgFile,
            name: this.cachedImgInfo.imgName,
            url:  this.cachedImgInfo.imgURL

          }
          this.createImage(this.itens[newItemIndex].img.src,this.itens[newItemIndex])
        }
        else{//caso criando algo novo e sem img ou editando algo sem img
          if(newItemIndex !== ''){//só sera dif se já tiver sido criado
            this.itens[newItemIndex].img = {
              src:  this.cachedImgInfo.imgFile,
              name: this.cachedImgInfo.imgName,
              url:  this.cachedImgInfo.imgURL
            }
          }    
        }
        //esvazia p uso futuro. lembre que só é possivel editar uma linha por vez :)
        this.cachedImgInfo.imgName = ''
        this.cachedImgInfo.imgFile = ''
        this.cachedImgInfo.imgURL = ''
      },
      createImage(file, item) {
        let image = new Image();
        var reader = new FileReader(); 
        reader.onload = (e) => {
           item.img.src = e.target.result//this.editedItem.img.src = e.target.result
        }
        reader.readAsDataURL(file);// console.log("crie img")
      }
    }
  }
</script>