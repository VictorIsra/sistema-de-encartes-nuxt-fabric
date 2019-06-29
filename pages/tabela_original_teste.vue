<!-- //arquivo igual ao componente tabelaProdutos.vue mas numa localizacao onde posso debuga-lo sem ter que repetir a etapa 1
-->
<template>
  <div> 
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
            <!-- v-model.lazy="valid"  botava no v-vartext abaixo, mas por hr, ignoro isso-->
          <v-card-text  > <!-- informacoes de adicionar e deletar (é um form)-->
            <v-container grid-list-md >
              <v-layout wrap>
                 <v-flex xs12>
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
                <v-flex>
                  <datas  :checkDataRange="checkDataRange" 
                          :defaultDatesValues="defaultDatesValues" 
                           @datechanged="getDate"
                           @blur="editUserInputs(false)"
                           @dateStatusInfo="getDateStatus"           
                    />              <!--<v-text-field v-model="editedItem.data_i" label="Data de início"></v-text-field> -->
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
        <td class="text-xs-center"><img :src="getImgURL(props.item)" width="50px" height="50px" v-bind:alt="props.item.img.src"></td>
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
  import datas from  './datas_teste.vue'
  import formatInputMixin from '../components/mixins/FormatInputMixin.js'
  import crudMixin from '../components/mixins/CRUD.js'

  export default {
    components: {
      'img-upload': imgUpload,
      datas
    },
    mixins: [
      formatInputMixin,
      crudMixin
    ],
    data: () => ({
      inputsValidation: {//usarei isso pra definir a validade dos inputs de forma eficaz
        nome:     true,
        qtdade:   true,
        unidade:  true,
        preco_c:  true,
        preco_v:  true,
        marluc:   true
      },
      dialog: false,
      search: '',
      valid: false,
      metaProdutos: '',//qtdade minima de produtos na campanha
      datesErrors: ['#'],//é uma pilha que checa os erros nas datas. nao terá erro qd ela só tiver o elemento base('#'), ou seja, se datesErros.length ===1
      //PROPS (lembrar que, na verdade, são props para um componente filho
        checkDataRange: {
          checkRange: true,
          Pdata_i: '22/3/2019',//virá da etapa um 
          Pdata_f: '12/12/2019'
        },
        //fim de info relativa a validacao de datas.^
        defaultDatesValues: {//valor das datas em uma linha em particular da tabela. É uma prop
          Rdata_i: '', //de 'row data inicio'
          Rdata_f: '',
          flag: 0
        },
        //prop' que indicará pro componente filho (image_upload) as img que devem ser mostradas qd um dialog/form abrir
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
          console.log("VOU VALIDAR ", this.valid)
          //this.validate()
        }
      },
      inputsValidation: {
        handler(val, oldVal){
          console.log("MUDEI ALGO WATCH VALIDATION")
          this.validate()
        },
        deep: true
      }
    },
    created () {
      this.initialize()//sera alimentado pelo bd eventualmente, tvz?
    },
    methods: {
      initialize () {
        this.itens = []
      },
      prepareImgInfo(currentItem){//envia pro componente filho image_uload.vue os valores ( sao props no comp filho) a serem colocados ao abrir a aba/form de edit
        //é dif do cached info, pois aqui, é alimentado com info do db, e o db n salva a url ( pq é um buffer) e tal
        this.imgInfo.imgFile = currentItem.img.src
        //this.imgInfo.imgURL = currentItem.img.url//funciona mas n quero salva no bd pq iso é um arraybuffer, se pa é bad practice
        this.imgInfo.imgName = currentItem.img.originalName
        this.imgInfo.flag = 1
      },
      editItem (item) {
        this.editedIndex = this.itens.indexOf(item)
        this.editedItem = Object.assign({}, item)//copia os itens de uma linha para um novo objeto e o associa ao dialog de edicao ( dialog recebe o objeto copiado retornado)
        this.sendDefaultDates(1)//pro componente filho mostrar as dates referentes a linha correspondente ao se abrir o dialog
        this.prepareImgInfo(this.editedItem)
        this.editUserInputs(false)
        this.dialog = true  
      },
      addItem(flag){
        this.imgInfo.flag = flag//garante q nao vai ter uma img pre definida ao abrir o dialog
        this.sendDefaultDates(flag)
      },
       deleteItem (item) {
        const index = this.itens.indexOf(item)
        this.editedItem = Object.assign({}, item)
        let targetId = this.editedItem._id.data//qt crio manualmente, o _id é um objeto cuso _id de interesse tá no atributo dat
        if(targetId === undefined)//mas qt dou um get do bd, ele seta o _id direto como um atributo, esse if vai ajustar pra ambos os casos xD
          targetId = this.editedItem._id
       // console.log("target: ", targetId, typeof(targetId))
        confirm('Você tem certeza de que deseja remover este item?') && ( this.itens.splice(index, 1) && this.removeRow(targetId))
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
      async save () {
        if (this.editedIndex > -1) {//na edicao, preciso editar antes do assign, se nao vou modificar uma copia q nao é mais usada
            this.editUserInputs()
            await this.fillImgInfo('',this.editedItem)
            Object.assign(this.itens[this.editedIndex], this.editedItem)
            this.updateRow(this.editedItem)
        } else {//caso esteja adicionando algo em vez de editando
            await this.fillImgInfo(0,this.editedItem)
            this.itens.unshift(this.editedItem)//adicionar ao topo da lista, em vez de no final
            this.editUserInputs()
            this.addRow(this.editedItem)//na real nem precisava passa isso como arg mas foda-se
        }
        this.saveProdutos()
        this.close()      
      },
      saveProdutos(){
        this.$store.dispatch('campanhas/set_produtos',this.itens)//salva os valores da tabela globalmente
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
        this.defaultDatesValues.flag = 1//p garantir que, na hr de criar o item, apos o user interagir com uma data, volte a validacao default (msg vermelha feia e irritante xD)
        this.validate()
      },
      getDateStatus(info){//se o componente filho viu que a data é invalida ( fora do range), adiciona um item a pilha de erros
          //lembre, as datas só serao validadas se o tamanho da pilha for 1 ( só tiver o elemento base da pilha ('#'))
            if(!this.dialog)//só quero checar e mexer na pilha se um form/dialog tiver aberto
              return
          //console.log("ENTREweI COM caler ", info.caller ," e stat ", info.status)
          const duplicates = this.datesErrors.find(obj => //checa se nao estou adicionando um el repetido a pilha
            info.status === obj.status && info.caller === obj.caller )
         
          if(duplicates === undefined && info.status !== 0 ){//status 0 é pq n teve erro, só quero preencher se foi error ( 1)
            if(info.caller !== -1)// se caller != -1 é pq sao datas difs e invalidas
                this.datesErrors.unshift(info)
            else{//se caller = -1 é pq sao datas iguais e invalidas
              if(this.datesErrors.length < 3){//se é  3 é pq ambas as invalidas ja tao na pilha, entao nada devo fazer, caso contrário devo adicionar as 2 datas a pilha de erro
                var i
                this.resetDateErrorStack()//reseto a pilha e adiciono as 2 datas invalidas e iguais, pois:
                for(i = 0; i < 2;i++){//se length é menor que 3 e caller é -1, é pq ambas sao iguais e invalidas, logo adiciono ambas a pilha
                  this.datesErrors.unshift({
                    status: 1,
                    caller: i
                  })
                }  
              }
            }   
          }   
          if(info.status === 0 ){//se a data nao é mais invalida, removo da  pilha o item que indicava que aquela data era invalida
            if(info.caller === -1)//datas sao iguais e validas, esvazio a pilha
              this.resetDateErrorStack()
            else{//datas sao dif, mas alguma delas agora é valida, logo removo só uma data da pilha de erros  
              this.datesErrors.forEach((obj,i) => {
                if(info.caller === obj.caller)
                  this.datesErrors.splice(i,1)//se removi algo é pq corrigiu algo, mas só sera valido totalmente qd a o tamanho da pilha for 1 (só ter a base dela)
              })
            }  
          }
          this.validate()//tenta validar
      },
      resetDateErrorStack(){//validacao só fará sentido qd o dialog tiver aberto, qd fechado, limpar a pilha
        this.datesErrors = ['#']
      },
      fillCachedImgInfo(data){//componente filho img-upload enviará um evento e esta f será triggada por este evento
        //cacheio esses resultados e só associo a variavel 'itens' qd o usuario quiser salvar de fato a img
        this.cachedImgInfo.imgName = data.name
        this.cachedImgInfo.imgFile = data.file
        this.cachedImgInfo.imgURL = data.url
      },
      async fillImgInfo(newItemIndex = '', editedItem){   
        //LEMBRE: img name e url parecem inuteis a lvl de bd, mas sao fundamentais pro usuario interagir/ver a lvl de app!
         //só guardarei a foto escolhida se ele salvou algo, se nao, nao
        //sera chamada se o user de fato quis salvar uma img e ela nao for em branco, pois caso seja, n tem objeto pra criar e daria erro!
        if(this.cachedImgInfo.imgFile !== '' && newItemIndex === ''){//caso editando algo existente c img
         await this.imgUpload(this.cachedImgInfo.imgFile,editedItem)
        }
        else if(this.cachedImgInfo.imgFile !== '' && newItemIndex !== ''){//caso criando algo novo  que contenha img
          await this.imgUpload(this.cachedImgInfo.imgFile, editedItem)
        }
        //esvazia p uso futuro. lembre que só é possivel editar uma linha por vez :)
        this.cachedImgInfo.imgName = ''
        this.cachedImgInfo.imgFile = ''
        this.cachedImgInfo.imgURL = ''
      },
      validate(){
        let datesValid = this.datesErrors.length === 1 ? true : false//checa validade para das datas, que tem uma logica particular
          if(datesValid && this.editedItem.data_i !== '' && this.editedItem.data_f !== '')
            datesValid = true
          else
            datesValid = false
      
        const values = Object.values(this.inputsValidation)//
        var valid = values.filter(v => { return v === false} )//checa validade de todos os inputs que nao sejam datas, pois estas tem validacao especial

        if(valid.includes(false) || !datesValid){//se os campos ou alguma data for inválida, invalide o form/dialog
          console.log(" FORM invalido")
          this.valid = false
        }  
        else if(!valid.includes(false) && datesValid){//caso contrário, valide
          console.log(" Form valido!")
          this.valid  = true
        }  
        return this.valid
      },
      getImgURL(item){
        //se uma img nao tiver sido escolhida, retorne enm branco
        const path = item.img.name === undefined ? "" : "uploads/fotos/" + item.img.name
        return path
      },
      //RULES:
      nomeRule(v){
        if(!!v === false)
           this.inputsValidation['nome'] = false
        else
          this.inputsValidation['nome'] = true
        return !!v || "é preciso escolher um nome para o produto. "
      },
      qtdadeRule(v){
        if(!!v === false)
           this.inputsValidation['qtdade'] = false
        else
          this.inputsValidation['qtdade'] = true

         return !!v || 'a quantidade é obrigatória'
      },
      preco_cRule(v){
        if(!!v === false)
           this.inputsValidation['preco_c'] = false
        else
          this.inputsValidation['preco_c'] = true
        
        return  !!v || 'o preço de compra e é obrigatório'
      },
      preco_vRule(v){
        if(!!v === false)
           this.inputsValidation['preco_v'] = false
        else
          this.inputsValidation['preco_v'] = true

        return !!v || 'o preço de venda e é obrigatório'
      },
      marlucRule(v){
        if(!!v === false)
           this.inputsValidation['marluc'] = false
        else
          this.inputsValidation['marluc'] = true

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
      }
    }
  }
</script>