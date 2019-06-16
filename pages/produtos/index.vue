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
          <v-btn color="primary" dark class="mb-2" @click="addItem(-1)" v-on="on" >Adicionar novo produto</v-btn> <!--v-on="on" -->
        </template>
        <v-card > <!-- o form em si é esse v card! -->
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          
          <v-card-text v-model.lazy="valid" ref="editedItem"> <!-- informacoes de adicionar e deletar (é um form)-->
            <v-container grid-list-md >
              <v-layout wrap>
                 <v-flex xs12 >
                 <img-upload @blur="editUserInputs(false)" :imgInfo="imgInfo" @imgUploaded="fillCachedImgInfo"/>
                </v-flex>
                 <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.nome"
                                @blur="editUserInputs(false)"
                                v-model.trim="editedItem.nome"
                                :rules="[nomeRule]" 
                                label="Produto">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.empresa" 
                                :rules="[nomeEmpresaRule]"
                                v-model="editedItem.empresa"
                                @blur="editUserInputs(false)"
                                label="Empresa"></v-text-field>
                </v-flex>
                
                <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.refe"  
                                v-model="editedItem.refe"
                                @blur="editUserInputs(false)"
                                label="Referência"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field ref="editedItem.cat" justify-center 
                                v-model.trim="editedItem.cat" 
                                :rules="[catRule]"
                                 @blur="editUserInputs(false)"
                                label="Categoria"></v-text-field>
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
        <td class="text-xs-center">{{ props.item.empresa }}</td>
        <td class="text-xs-center">{{ props.item.refe }}</td>
        <td class="text-xs-center">{{ props.item.cat }}</td>
        <td class="text-xs-center">{{ props.item.preco_c }}</td>
        <td class="text-xs-center">{{ props.item.preco_v }}</td>
        <td class="text-xs-center">{{ props.item.qtdade }}</td>
        <td class="text-xs-center">{{ props.item.unidade }}</td>


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
  import imgUpload from '../../components/campanhas/generalUseComponents/image_upload.vue'
  import datas from  '../../components/campanhas/generalUseComponents/datas.vue'
  import formatInputMixin from '../../components/mixins/FormatInputMixin.js'
  import imgMixin from '../../components/mixins/ImgMixin.js'
  
  export default {
    components: {
      'img-upload': imgUpload,
      datas
    },
    props: {
        campanhaDates:{//etapa um passará isso
          type: Object,
          default:function(){
            return {
              data_inicio: '1/1/2019',
              data_termino: '1/2/2020'
            }
          }
        }
    },
    mixins: [
      formatInputMixin,
      imgMixin
    ],
    mounted: function(){
      // console.log("Iii ")
      // this.checkDataRange.Pdata_i = this.campanhaDates.data_inicio
      // this.checkDataRange.Pdata_f = this.campanhaDates.data_termino
    },
    data: () => ({
      dialog: false,
      search: '',
      valid: true,
      //que indicará pro componente filho (image_upload) as img que devem ser mostradas qd um dialog/form abrir
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
        { text: 'EMPRESA', value: 'empresa' },
        { text: 'REFERÊNCIA', value: 'refe' },
        { text: 'CATEGORIA', value: 'cat' },
        { text: 'PREÇO DE COMPRA', value: 'preco_c' },
        { text: 'PREÇO DE VENDA', value: 'preco_v' },
        { text: 'ESTOQUE', value: 'qtdade' },
        { text: 'UNIDADE', value: 'unidade' },  
        { text: 'AÇÕES', value: 'acao' } 
      ],
      itens: [],
      editedIndex: -1,
      editedItem: {
        img:  '',
        nome: '--',
        empresa:'--',
        refe: '--',
        cat: '--',
        preco_c: '0,00',
        preco_v: '0,00',   
        qtdade: '0.00',
        unidade: '--'
         
      },
      defaultItem: {//aqui seto os valores defaults
        img:  '',
        nome: '--',
        empresa:'--',
        refe: '--',
        cat:'--',
        preco_c: '0,00',
        preco_v: '0,00',   
        qtdade: '0.00',
        unidade:'--'
      }
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Produto:' : 'Editando Produto:'
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
  
        this.itens = [
          // {
          //   img:  {
          //     src: '',
          //     name: 'hehe.jpg',
          //     url: ''
          //   },
          //   nome: 'Arroz',
          //   qtdade: 409,
          //   unidade: 'kg',
          //   obs: 'nada a declarar',
          //   data_i: '23/06/2019',
          //   data_f: '23/06/2019',
          //   preco_c: '130$',
          //   preco_v: '303$',
          //   selout: '--',
          //   marluc: '10%'
          // },
          //  {
          //   img:  {
          //     src: '',
          //     name: 'xd.jpg',
          //     url: ''
          //   },
          //   nome: 'feijao',
          //   qtdade: 1000,
          //   unidade: 'kg',
          //   obs: 'nada a declarar',
          //   data_i: '11/05/2019',
          //   data_f: '23/06/2019',
          //   preco_c: '1300',
          //   preco_v: '3033',
          //   selout: '--',
          //   marluc: '130%'
          // }
         
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
        this.prepareImgInfo(this.editedItem)
        this.editUserInputs(false)
        this.dialog = true  
      },
      addItem(flag){
        this.imgInfo.flag = 1//garante q nao vai ter uma img pre definida ao abrir o dialog
        this.validate()
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
        this.imgInfo.flag = 0
      },
      save () {
        if (this.editedIndex > -1) {//na edicao, preciso editar antes do assign, se nao vou modificar uma copia q nao é mais usada
            this.editUserInputs()
            Object.assign(this.itens[this.editedIndex], this.editedItem)
            this.fillImgInfo()
        } else {//caso esteja adicionando algo em vez de editando
            this.itens.unshift(this.editedItem)//adicionar ao topo da lista, em vez de no final
            this.editUserInputs()
            this.fillImgInfo(0)
        }
        this.close()      
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
      validate(){
        const valid = []//verá quantos itens passarão no teste de validade 
        //checando a validade dos campos obrigatórios que nao sejam datas    
        Object.keys(this.editedItem).forEach((f,index) => {
          if(index !== 0)//se n for img, de boa usar o metodo validate
            valid.push(this.$refs["editedItem." + f.toString()].validate(true)) 
        })
        if(valid.includes(false)){//se algum dos campos  for inválido, invalide o form/dialog
          console.log(" FORM invalido")
          this.valid = false
        }  
        else if(!valid.includes(false)){//caso contrário, valide
          console.log(" Form valido!")
          this.valid  = true
        }  
      },
      //RULES:
      nomeRule(v){
          return !!v || "é preciso escolher um nome para o produto. "
      },
      catRule(v){
          return !!v || "é preciso escolher um cateiagoria para o produto. "
      },
      nomeEmpresaRule(v){
          return !!v || "é preciso entrar com o nome da empresa. "
      },
      qtdadeRule(v){
         return !!v || 'a quantidade é obrigatória.'
      },
      preco_cRule(v){
        return  !!v || 'o preço de compra e é obrigatório.'
      },
      preco_vRule(v){
        return !!v || 'o preço de venda e é obrigatório.'
      },
      editUserInputs(addUnit = true){//addUnit para botar o R$ e afins. quero isso pra salvar na tabela, mas nao quero isso ( addUnit = false) qd abrir uma form/dialog pra edicao
        this.editedItem.qtdade = this.parsePtBr(this.editedItem.qtdade)
        this.editedItem.preco_c = this.parsePtBr(this.editedItem.preco_c)
        this.editedItem.preco_v = this.parsePtBr(this.editedItem.preco_v)
        if(addUnit){
          this.editedItem.preco_c = 'R$ ' + this.editedItem.preco_c
          this.editedItem.preco_v = 'R$ ' + this.editedItem.preco_v
        }
      }
    }
  }
</script>