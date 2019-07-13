<template>
  <div>
       <v-toolbar flat color="white"><!-- store direto pq no date n da p referenciar o this e tal, mais facil assim -->
    <span v-if="campanhaInfos" class="title font-weight-regular primary--text">Produtos cadastrados: {{produtosQtdadeInfo.qtdade}}/{{produtosQtdadeInfo.meta}}</span>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Buscar demanda"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" @click="addItem(-1)" v-on="on" >Adicionar demanda</v-btn> <!--v-on="on" -->
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
      item-key="data_i"
    > 
      <template v-slot:items="props"> <!-- {{ props.item.img }}-->
        <tr @click="props.expanded = !props.expanded">
          <td class="text-xs-center"><img :src="getImgURL(props.item)" width="50px" height="50px" v-bind:alt="props.item.img.src"></td>
          <td class="text-xs-center">{{ props.item.nome }}</td>
          <td class="text-xs-center">{{ props.item.data_i }}</td>
          <td class="text-xs-center">{{ props.item.data_f }}</td>
          <td class="text-xs-center">{{ props.item.preco_v }}</td>
          <td  v-if="props.item.tabloide !== undefined" >
            <v-checkbox  color="success" class="justify-end layout px-1" v-model="props.item.tabloide"></v-checkbox>   
          </td>
          <td v-if="props.item.cartaz !== undefined" >
            <v-checkbox color="success" class="justify-end layout px-1" v-model="props.item.cartaz"></v-checkbox>   
          </td>
          <td v-if="props.item.facebook !== undefined" >
            <v-checkbox color="success" class="justify-end layout px-1" v-model="props.item.facebook"></v-checkbox>   
          </td>
           <td v-if="props.item.tvindoor !== undefined" >
            <v-checkbox color="success" class="justify-end layout px-1" v-model="props.item.tvindoor"></v-checkbox>   
          </td>
          <td v-if="props.item.radio_interna !== undefined" >
            <v-checkbox color="success" class="justify-center" v-model="props.item.radio_interna"></v-checkbox>   
          </td>
           <td v-if="props.item.radio_externa !== undefined" >
            <v-checkbox color="success" class="justify-center" v-model="props.item.radio_externa"></v-checkbox>   
          </td>
          <td v-if="props.item.jornais !== undefined" >
            <v-checkbox color="success" class="justify-end layout px-1" v-model="props.item.jornais" ></v-checkbox>   
          </td>
           <td v-if="props.item.pov !== undefined" >
            <v-checkbox color="success" class="justify-end layout px-0" v-model="props.item.pov" ></v-checkbox>   
          </td>
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
            <span span class="subheading">Clique aqui para escrever uma observação sobre essa demanda</span>
            </v-tooltip>
            <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-2"
                @click="saveTick(props.item)"
                v-on="on"
              >
                save
              </v-icon>
            </template>
            <span span class="subheading">Clique aqui para salvar alterações da demanda</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <template v-slot:expand="props">
        <v-card flat>
          <v-card-text>texto grande p kralho mano, puta que pariu varios tiro de fuziiiltexto grande p kralho mano, puta que pariu varios tiro de fuziiiltexto grande p kralho mano, puta que pariu varios tiro de fuziiiltexto grande p kraltexto grande p kralho mano, puta que pariu varios tiro de fuziiiltexto grande p kralho mano, puta que pariu varios tiro de fuziiiltexto grande p kralho mano, puta que pariu varios tiro de fuziiilho mano, puta que pariu varios tiro de fuziiil</v-card-text>
        </v-card>
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
  import imgUpload from '../../components/campanhas/generalUseComponents/image_upload.vue'
  import datas from  '../../components/campanhas/generalUseComponents/datas.vue'
  import formatInputMixin from '../../components/mixins/FormatInputMixin.js'
  import crudMixin from '../../components/mixins/CRUD.js'
  import demandas from '../../components/demandaDiretor/step4/demandas.vue'

  export default {
    components: {
      'img-upload': imgUpload,
      datas,demandas
    },
    mixins: [
      formatInputMixin,
      crudMixin
    ],
    props:['campanha_id','campanhaInfos'],
    data: () => ({
      produtosQtdadeInfo: {//referente a qtdade de protudos cadastrados e metas, nao é o this.campanhaInfo.produtos ou this.campanhaInfo.qtdade pois este só da o fetch uma unica vez, vou mudar seu valor a lvl de app, e a lvl de bd somente atraves da pag de campanhas ;)
        meta: '',
        qtdade: ''
      },
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
      datesErrors: ['#'],//é uma pilha que checa os erros nas datas. nao terá erro qd ela só tiver o elemento base('#'), ou seja, se datesErros.length ===1
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
        { text: 'IMAGEM', value: 'img' ,align: 'center' },
        { text: 'PRODUTO', value: 'nome',align: 'center' },
        { text: 'DATA DE INÍCIO', value: 'data_i' ,align: 'center' },
        { text: 'DATA DE TÉRMINO', value: 'data_f',align: 'center' },
        { text: 'PREÇO DE VENDA', value: 'preco_v' ,align: 'center' },
        { text: 'TABLÓIDE', value: 'preco_v' ,align: 'center' },
        { text: 'CARTAZ', value: 'preco_v' ,align: 'center' },
        { text: 'FACEBOOK', value: 'preco_v' ,align: 'center' },
        { text: 'TV INDOOR', value: 'preco_v' ,align: 'center' },
        { text: 'RÁDIO INTERNA', value: 'preco_v' ,align: 'center' },
        { text: 'RÁDIO EXTERNA', value: 'preco_v' ,align: 'center' },
        { text: 'JORNAIS', value: 'preco_v' ,align: 'center' },
        { text: 'POV', value: 'preco_v' ,align: 'center' },
        { text: 'AÇÕES', value: 'obs',align: 'center' },
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
        selout: '--',
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
        selout: '--',
        marluc: '0.00'
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
      inputsValidation: {
        handler(val, oldVal){
          console.log("MUDEI ALGO WATCH VALIDATION")
          this.validate()
        },
        deep: true
      },
      produtosQtdadeInfo:{
        handler(){
          this.$emit('produtoQtdadeChange',this.produtosQtdadeInfo)
        },
        deep: true//fundamental ein!
      },
      campanhaInfos:{
        handler(){
          //só servirá pra indicar a qtdade caso o user crie a campanah e ja comece a ad produtos sem voltar pro painel de listagem de campanhas xD
          this.setMetasProdutos()
        },
        deep: true
      }
    },
    created () {
      this.initialize()//sera alimentado pelo bd eventualmente, tvz?
    },
    methods: {
      initialize () {
        if(this.campanha_id !== undefined && this.campanha_id !== '-1')
          this.fetchProdutos()
        else
          console.log("escolhaprodutos.vue : nenhum id valido por hora ")  
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
        this.prepareImgInfo(this.editedItem)
        this.editUserInputs(false)
        this.dialog = true  
      },
      addItem(flag){
        this.resetValues()        
        this.imgInfo.flag = flag//garante q nao vai ter uma img pre definida ao abrir o dialog
      },
      resetValues(){
        //p dps de uma remocao, ao eu add um novo item, os campos n terem mais relacao com o que foi deletado
        this.editedItem = {
          img:  '',
          nome: '--',
          qtdade: '0.00',
          unidade: '--',
          obs: '--',
          data_i: '',
          data_f: '',
          preco_c: '0,00',
          preco_v: '0,00',
          selout: '--',
          marluc: '0.00'
        }
      },
      deleteItem (item) {
        const index = this.itens.indexOf(item)
        this.editedItem = Object.assign({}, item)
        let targetId = this.editedItem._id.data//qt crio manualmente, o _id é um objeto cuso _id de interesse tá no atributo dat
        if(targetId === undefined)//mas qt dou um get do bd, ele seta o _id direto como um atributo, esse if vai ajustar pra ambos os casos xD
          targetId = this.editedItem._id
        const imgSrc = this.editedItem.img.src//path pra img que irei excluir
        confirm('Você tem certeza de que deseja remover este item?') && ( this.itens.splice(index, 1) && this.decrementProdutos(true) && this.removeRow(targetId,imgSrc,this.campanha_id))
     },
      close () {
        this.resetImgCached()
        this.resetFlags()
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      resetImgCached(){
        //reseta os valores cacheados, pois ao se fechar, preciso setar eles pra '', se nao é possivel q eu atualize uma foto sem querer, simplesmente pq escolhi uma ( mas dps cancelei), com essa f, garanto que, se eu ecolher algo mas dps fechar o dialog sem salvar, nenhuma img nova sera salva xD
       //eu ja fazia essa operacoa antes, mas o segredo é faze-la neste nesta f, no momento de fechar, e n apenas num save da vida
        this.cachedImgInfo.imgName = ''
        this.cachedImgInfo.imgFile = ''
        this.cachedImgInfo.imgURL = ''
      },
      resetFlags(){//reseta as flags que sao props em componentes filhos, pra que o watch sempre observe mudanca
        this.imgInfo.flag = 0
      },
      async save () {
        if (this.editedIndex > -1) {//na edicao, preciso editar antes do assign, se nao vou modificar uma copia q nao é mais usada
            this.editUserInputs()
            //console.log(" imgs ", this.editedItem.img)
            await this.fillImgInfo('',this.editedItem)
            Object.assign(this.itens[this.editedIndex], this.editedItem)
            this.updateRow(this.editedItem,this.campanha_id)
        } else {//caso esteja adicionando algo em vez de editando
            await this.fillImgInfo(0,this.editedItem)
            this.itens.unshift(this.editedItem)//adicionar ao topo da lista, em vez de no final
            this.editUserInputs()
            this.addRow(this.editedItem,this.campanha_id)//na real nem precisava passa isso como arg mas foda-se
            this.decrementProdutos(false)//qd passo flag flase, eu INCREMENTO 
        }
        //this.saveProdutos()
        this.close()      
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
          //console.log("entreii com ",  this.imgInfo.imgFile, " novo ", editedItem.img.src)
          await this.imgUpload(this.cachedImgInfo.imgFile,editedItem,)
        }
        else if(this.cachedImgInfo.imgFile !== '' && newItemIndex !== ''){//caso criando algo novo  que contenha img
          await this.imgUpload(this.cachedImgInfo.imgFile, editedItem)
        }
      },
      validate(){
        const values = Object.values(this.inputsValidation)//
        var valid = values.filter(v => { return v === false} )//checa validade de todos os inputs que nao sejam datas, pois estas tem validacao especial

        if(valid.includes(false)){//se os campos ou alguma data for inválida, invalide o form/dialog
          console.log(" FORM invalido")
          this.valid = false
        }  
        else if(!valid.includes(false)){//caso contrário, valide
          console.log(" Form valido!")
          this.valid  = true
        }  
        return this.valid
      },
      getImgURL(item){
        //se uma img nao tiver sido escolhida, retorne enm branco
        const path = item.img.name === undefined ? "" : "../../../uploads/fotos/" + item.img.name
        return path
      },
      async fetchProdutos(){
        this.itens = await this.getProdutos(this.campanha_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
        this.setMetasProdutos()
      },
      setMetasProdutos(){//seta o valor inicial da meta de produtos, dps, isso será controlado a lvl de app, e nao de bd. de bd somente vindo da pag campanhas. Ao interagir aqui dentro, será só a lvl de app ( incrementando e decrementando baseado nas acoes)
        this.produtosQtdadeInfo.meta = this.campanhaInfos.qtdade
        if(this.campanhaInfos.produtos !== undefined)//erro estranho, q n muda nada, é tipo um warning mas q ocorre só qd ligo o server pela primeira vez no dia o.o
          this.produtosQtdadeInfo.qtdade = this.campanhaInfos.produtos.length
      },
      decrementProdutos(flag){//muda a qtdade dep rodutos cadastradas indicada no painel a lvl de app
        if(flag){
          this.produtosQtdadeInfo.qtdade --
          return true
        }  
        else
          this.produtosQtdadeInfo.qtdade ++  
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
