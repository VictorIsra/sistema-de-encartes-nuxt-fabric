<!-- //arquivo igual ao componente tabelaProdutos.vue mas numa localizacao onde posso debuga-lo sem ter que repetir a etapa 1
-->
<template>
  <div>
    <v-btn @click="validate"> TESTEEE</v-btn>
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
          
          <v-card-text v-model="valid" ref="editedItem"> <!-- informacoes de adicionar e deletar (é um form)-->
            <v-container grid-list-md >
              <v-layout wrap>
                 <v-flex >
                 <img-upload :imgInfo="imgInfo" @imgUploaded="fillCachedImgInfo"/>
                </v-flex>
                 <v-flex xs12 sm6 md4>
                  <v-text-field ref="editedItem.nome"
                                v-model="editedItem.nome" label="Produto">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field ref="editedItem.qtdade" 
                                :rules="[() => editedItem.qtdade >= 0 || 'a quantidade deve ser um número']" 
                                v-model="editedItem.qtdade"
                                label="Estoque"
                                type="number">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field ref="editedItem.unidade"
                                v-model="editedItem.unidade" 
                                label="Unidade"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field ref="editedItem.obs" v-model="editedItem.obs" label="Observação"></v-text-field>
                </v-flex>
                <v-flex>
                  <datas  :checkDataRange="checkDataRange" 
                          :defaultDatesValues="defaultDatesValues" 
                           @datechanged="getDate"
                           @dateStatusInfo="getDateStatus"           
                    />              <!--<v-text-field v-model="editedItem.data_i" label="Data de início"></v-text-field> -->
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field  ref="editedItem.preco_c"
                                 min="1" step="any"
                                 v-model="editedItem.preco_c" 
                                 :rules="[() => editedItem.preco_c >= 0 || 'o preço de compra deve ser um número ']" 
                                 label="Preço de compra"
                                 type="number">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field ref="editedItem.preco_v"
                                v-model="editedItem.preco_v" 
                                min="1" step="any"
                                type="number"
                                :rules="[() => editedItem.preco_v >= 0 || 'o preço de venda deve ser um número']" 
                                label="Preço de venda">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field ref="editedItem.selout" v-model="editedItem.selout" label="Sell out"></v-text-field>
                </v-flex>
                <v-flex >
                  <v-text-field ref="editedItem.marluc" justify-center 
                                v-model="editedItem.marluc" 
                                :rules="[() => editedItem.marluc >= 0 || 'a margem de lucro deve ser um número']"
                                type="number" 
                                label="Margem de lucro"></v-text-field>
                </v-flex>
                
              </v-layout>
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  color="primary" @click="close">Cancelar</v-btn>
            <v-btn  color="primary" ref="savebtn" :disabled="!valid"  @click="save">Salvar</v-btn>
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
  import imgUpload from '../components/campanhas/generalUseComponents/image_upload.vue'
  import datas from  '../components/campanhas/generalUseComponents/datas.vue'
 
  export default {
    components: {
      'img-upload': imgUpload,
      datas
    },
  
    data: () => ({
      savebtn: '',
      dialog: false,
      search: '',
      valid: true,
      datesErrors: [''],//é uma pilha que checa os erros nas datas. nao terá erro qd ela só tiver o elemento base(''), ou seja, se datesErros.length ===1
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
      },
      valid:{
        handler(){
          //console.log("validando ")
          this.validate()
        }
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
        this.sendDefaultDates(1)//pro componente filho mostrar as dates referentes a linha correspondente ao se abrir o dialog
        this.prepareImgInfo(this.editedItem)
        this.validate()
        this.dialog = true  
      },

      deleteItem (item) {
        const index = this.itens.indexOf(item)
        confirm('Você tem certeza de que deseja remover este item?') && this.itens.splice(index, 1)
      },
    
      close () {
        this.resetFlags()
        this.resetDateErrorStack()
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
            this.itens.unshift(this.editedItem)//adicionar ao topo da lista, em vez de no final
            this.fillImgInfo(0)
        }
        this.close()      
      },

      getDate(data){//pega as datas formatadas no componente filho 'datas.vue'
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
      getDateStatus(info){//se o componente filho viu que a data é invalida ( fora do range), adiciona um item ao vetor de erros
          //lembre, as datas só serao validadas se o tamanho da pilha for 1 ( só tiver o elemento base da pilha)
          const duplicates = this.datesErrors.find(obj => //checa se nao estou adicionando um el repetido a pilha
            info.status === obj.status && info.caller === obj.caller)
         
          if(duplicates === undefined && info.status !== 0)//status 0 é pq n teve erro, só quero preencher se foi error ( 1)
             this.datesErrors.unshift(info)
          if(info.status === 0 ){//se a data nao é mais invalida, removo do array ( pilha ) o item que indicava que aquela data era invalida
            this.datesErrors.forEach((obj,i) => {
              if(info.caller === obj.caller)
                this.datesErrors.splice(i,1)
            })
          }
          this.validate()//tenta validar
      },
      resetDateErrorStack(){//validacao só fará sentido qd o dialog tiver aberto, qd fechado, limpar a pilha
        this.datesErrors = ['']
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
           item.img.src = e.target.result
        }
        reader.readAsDataURL(file);// console.log("crie img")
      },
      validate(){
        console.log("ME CHAMOS")
        const valid = []
        const datesValid = this.datesErrors.length === 1 ? true : false
        //console.log("teste ", datesValid, " ", this.datesErrors.length)
        if(datesValid)
          console.log("val ")
        else
          console.log("Inva")  
        Object.keys(this.editedItem).forEach((f,index) => {

          //validando data:
          //blablba
          //validando inputs normais
          if(index !== 0 && index !== 5 && index !== 6){//se n for data nem img, de boa usar o metodo validate
            valid.push(this.$refs["editedItem." + f.toString()].validate(true))                           // console.log("!this.editemItem[f]: ", !this.editedItem)//se n tiver nada prenchido
          }
        })
        if(valid.includes(false)|| !datesValid){
          console.log("invalido")
          this.valid = false
          return false
        }  
        else if(!valid.includes(false) && datesValid){
          console.log("valido!")
          this.valid  
          return true
        }  
        //juntando as info pro veredito final
      }
    }
  }
</script>

