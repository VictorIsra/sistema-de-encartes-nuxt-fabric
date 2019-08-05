<template>
  <div>   
      <v-toolbar flat color="grey lighten-4">
          <v-toolbar-title>
            <v-layout align-center class="mr-2 primary--text">
              <v-img class="mr-2" width="50" src="../icones/demanda.png"></v-img>
              Demandas
            </v-layout>
          </v-toolbar-title>
          <v-divider
            class="mx-2"
            inset
            vertical
          ></v-divider>
      </v-toolbar>
          <v-toolbar v-if="userType === 'diretor'">
            <no-ssr>
                <v-list class="scroll-y">
                    <vue-select-image :useLabel="true" :dataImages="dataImages" h='50px' w='50px' @onselectimage="onSelectImage">
                    </vue-select-image>
                </v-list>
            </no-ssr>       
          </v-toolbar>
        <v-toolbar flat color="white"><!-- store direto pq no date n da p referenciar o this e tal, mais facil assim -->
        <span class="title font-weight-regular primary--text">Clique em uma linha para ver as observações relativas a demanda</span>
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
            <v-btn v-if="canAdd !== undefined " color="primary" dark class="mb-2" @click="addItem(-1)" v-on="on" >
            <v-icon class="mr-2">add</v-icon>
              Adicionar demanda</v-btn> <!--v-on="on" -->
          </template>
          
          <v-card > <!-- o form em si é esse v card! -->
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
              <!-- v-model.lazy="valid"  botava no v-vartext abaixo, mas por hr, ignoro isso-->
            <v-card-text  > <!-- informacoes de adicionar e deletar (é um form)-->
              <v-container grid-list-md >
                <v-layout wrap>
                 <!-- <v-flex xs12>
                  <img-upload @blur="editUserInputs(false)" :imgInfo="imgInfo" @imgUploaded="fillCachedImgInfo"/>
                  </v-flex> -->
                  <v-flex xs12 sm6>
                    <v-text-field ref="editedItem.nome"
                                  @blur="editUserInputs(false)"
                                  v-model.trim="editedItem.nome"
                                  :rules="[nomeRule]" 
                                  label="Produto">
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
                  <v-flex>
                    <datas
                            :defaultDatesValues="defaultDatesValues" 
                            @datechanged="getDate"
                            @blur="editUserInputs(false)"
                            @dateStatusInfo="getDateStatus"           
                      />              <!--<v-text-field v-model="editedItem.data_i" label="Data de início"></v-text-field> -->
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea   class=".body-2 primary--text"
                      outline
                      name="input-7-4"
                      label="Observação:"
                      v-model="editedItem.obs"
                      hint="escreva uma observação sobre esta demanda."
                    ></v-textarea>
                </v-flex>
                <v-flex>
                  <v-checkbox label="tabloide"  color="success" class="layout" v-model="editedItem.tabloide"></v-checkbox>   
                  <v-checkbox label="facebook"  color="success" class="layout" v-model="editedItem.facebook"></v-checkbox>   
                  <v-checkbox label="radio interna"  color="success" class="layout" v-model="editedItem.radio_interna"></v-checkbox>   
                  <v-checkbox label="jornais"  color="success" class="layout" v-model="editedItem.jornais"></v-checkbox>   
                </v-flex>
                <v-flex>
                  <v-checkbox label="cartaz"  color="success" class="layout" v-model="editedItem.cartaz"></v-checkbox>   
                  <v-checkbox label="tvindoor"  color="success" class="layout" v-model="editedItem.tvindoor"></v-checkbox>   
                  <v-checkbox label="radio externa"  color="success" class="layout" v-model="editedItem.radio_externa"></v-checkbox>   
                  <v-checkbox label="pov"  color="success" class="layout" v-model="editedItem.pov"></v-checkbox>   
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
        v-model="selected"
        item-key="_id"
      > 
        <template v-slot:items="props"> <!-- {{ props.item.img }}-->
          <tr @click="props.expanded = !props.expanded">
             <td class="justify-center layout px-0"> 
              <v-checkbox class="justify-center layout px-0"
                v-model="props.selected"
                primary
                hide-details
              ></v-checkbox>
            </td>
            <td class="text-xs-center"><img :src="getImgURL(props.item)" width="50px" height="50px" v-bind:alt="props.item.img.src"></td>
            <td class="text-xs-center">{{ props.item.nome }}</td>
            <td class="text-xs-center">{{ props.item.data_i }}</td>
            <td class="text-xs-center">{{ props.item.data_f }}</td>
            <td class="text-xs-center">{{ props.item.preco_v }}</td>
            <td  v-if="props.item.tabloide !== undefined" >
              <v-checkbox  color="success" @click.stop class="justify-end layout px-1" v-model="props.item.tabloide"></v-checkbox>   
            </td>
            <td v-if="props.item.cartaz !== undefined" >
              <v-checkbox color="success" @click.stop class="justify-end layout px-1" v-model="props.item.cartaz"></v-checkbox>   
            </td>
            <td v-if="props.item.facebook !== undefined" >
              <v-checkbox color="success" @click.stop class="justify-end layout px-1" v-model="props.item.facebook"></v-checkbox>   
            </td>
            <td v-if="props.item.tvindoor !== undefined" >
              <v-checkbox color="success" @click.stop class="justify-end layout px-1" v-model="props.item.tvindoor"></v-checkbox>   
            </td>
            <td v-if="props.item.radio_interna !== undefined" >
              <v-checkbox color="success" @click.stop class="justify-center" v-model="props.item.radio_interna"></v-checkbox>   
            </td>
            <td v-if="props.item.radio_externa !== undefined" >
              <v-checkbox color="success" @click.stop class="justify-center" v-model="props.item.radio_externa"></v-checkbox>   
            </td>
            <td v-if="props.item.jornais !== undefined" >
              <v-checkbox color="success" @click.stop class="justify-end layout px-1" v-model="props.item.jornais" ></v-checkbox>   
            </td>
            <td v-if="props.item.pov !== undefined" >
              <v-checkbox color="success" @click.stop class="justify-end layout px-0" v-model="props.item.pov" ></v-checkbox>   
            </td>
            <td class="justify-center layout px-0">
              <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-if="userType === 'diretor'"
                  small
                  class="mr-2"
                  @click="editItem(props.item)"
                  v-on="on"
                >
                  edit
                </v-icon>
                <v-icon
                  v-else
                  small
                  class="mr-2"
                  v-on="on"
                >
                  edit
                </v-icon>
              </template>
              <span span class="subheading" v-if="userType === 'diretor'">Clique aqui para editar esta demanda</span>
              <span span class="subheading" v-else>somente o diretor pode editar as informações de uma demanda</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat>
            <v-card-text>{{props.item.obs}}</v-card-text>
          </v-card>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            O produto "{{ search }}" não foi encontrado.
          </v-alert>
        </template>
      </v-data-table>
      <template v-if="!canAdd">
        <v-btn color="primary" to="/demandas">Voltar para listagem de demandas</v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" to="/analise">Voltar para análise</v-btn>
      </template>
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
    
    props:['campanhaInfos'],
    data: () => ({
      //variaveis necessarias pra lidar c lista de produtos do si
      dataImages: [],
      selected: [],//objetos selecionados  ( linhas da tabela selecionadas)
      selectedImg: '', //imagem da lista de produtos selecionada
      imgs: [],//imgs cadastradas no si
      //fim variaveis nece p lidar c lsita de produtos di si
      userType: '',//saber o tipo de user
      canAdd: undefined,//flag q indicará se posso adicionar o botao ou n
      campanha_id: undefined,//ao cadastrar um produto, ele gerará esse id. uma mini demanda é uma campanha com certos valores default, por isso,salvo a demanda como uma campanha com valores default,
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
        { text: '', value: 'sel' },
        { text: 'IMAGEM', value: 'img' , width: "1%", align: "center"},
        { text: 'PRODUTO', value: 'nome', width: "1%", align: "center"},
        { text: 'INÍCIO', value: 'data_i', width: "1%", align: "center"},
        { text: 'TÉRMINO', value: 'data_f', align: "center"},
        { text: 'PREÇO DE VENDA', value: 'preco_v' , width: "1%", align: "center"},
        { text: 'TABLÓIDE', value: 'preco_v' , width: "1%", align: "center"},
        { text: 'CARTAZ', value: 'preco_v', width: "1%", align: "center"},
        { text: 'FACEBOOK', value: 'preco_v' , width: "1%", align: "center"},
        { text: 'TV INDOOR', value: 'preco_v', width: "1%", align: "center"},
        { text: 'RÁDIO INTERNA', value: 'preco_v' , width: "1%", align: "center"},
        { text: 'RÁDIO EXTERNA', value: 'preco_v' , width: "1%", align: "center"},
        { text: 'JORNAIS', value: 'preco_v' , width: "1%", align: "center"},
        { text: 'POV', value: 'preco_v' , width: "1%", align: "center"},
        { text: 'AÇÕES', value: 'obs', width: "1%", align: "center"},
      ],
      itens: [],
      editedIndex: -1,
      editedItem: {
        img:  '',
        nome: '--',
        data_i: '',
        data_f: '',
        preco_v: '0,00',
        tabloide: false,
        cartaz: false,
        facebook: false,
        tvindoor: false,
        radio_interna: false,
        radio_externa: false,
        radio_externa: false,
        jornais: false,
        pov: false,
        obs: ''
      },
      defaultItem: {//aqui seto os valores defaults
        img:  '',
        nome: '--',
        data_i: '',
        data_f: '',
        preco_v: '0,00',
        tabloide: false,
        cartaz: false,
        facebook: false,
        tvindoor: false,
        radio_interna: false,
        radio_externa: false,
        radio_externa: false,
        jornais: false,
        pov: false,
        obs: ''
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
    },
    created () {
      this.initialize()//sera alimentado pelo bd eventualmente, tvz?
    },
    methods: {
      initialize () {
        this.userType = this.$store.state.auth.userType
        this.campanha_id = this.$route.params.campanha_id
        this.canAdd = this.$route.params.canAdd
        if(this.campanha_id !== undefined && this.campanha_id !== '-1'){
          this.fetchProdList()
          this.fetchProdutos()
        }  
        else{
          this.fetchProdList()
          console.log("escolhaprodutos.vue : nenhum id valido por hora ",this.campanha_id)  
        }
      },
      async fetchProdList(){//pega produtos cadastrados no si
            const prodListID = '5d2f6b45384572128c682715'//é unico no programa todo
            const lista = await this.getProdutos(prodListID)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
            lista.forEach(p => {
                if(p.img !== undefined && p.img !== '')
                    this.imgs.push( {
                      img:p.img,
                      prodNome: p.nome
                    })
            })
            this.prepareProdInfo()
        },
        prepareProdInfo(){//prepara oq sera exibido na lista de prod cadastrados
            this.imgs.forEach((img,i) => {
                let temp =  "../../../uploads/fotos/" + img.img.name
                this.dataImages.push({  
                    src: temp,
                    alt: img.prodNome,
                    originalName: img.img.originalName
                })
            })
        },
        onSelectImage(selected){//passado como arg indireto pelo compo vue-img
        this.selectedImg = selected
        
        this.ajustPath()
      },
      ajustPath(){//ajusta o path da img tanto rela qt abs
           let savedName = this.selectedImg.src.match(/[^/]+$/)//img com nome doido q é salva no static/uploads/img
          this.selected.forEach(item => {
            if(item.img === 'undefined ' || item.img === ''){//se n tiver foto associada

              item.img = {
                originalName: this.selectedImg.originalName,
                name: savedName,
                src:"static/uploads/fotos/" + savedName,
              }
              item.preco_c = this.selectedImg.preco_c
              item.preco_v = this.selectedImg.preco_v
              item.qtdade = this.selectedImg.qtdade
              item.unidade = this.selectedImg.unidade
              item.nome = this.selectedImg.alt
             //gambiarra mas funciona, atualizandocoreteamente em tods os cases xd
            }
            else{//se tiver,atualizo c a img selecionada
              item.img.originalName = this.selectedImg.originalName,
              item.img.name = savedName
              item.img.name.src = "static/uploads/fotos/" + savedName
              item.preco_c = this.selectedImg.preco_c
              item.preco_v = this.selectedImg.preco_v
              item.qtdade = this.selectedImg.qtdade
              item.unidade = this.selectedImg.unidade
              item.nome = this.selectedImg.alt
            }
            console.log("TES ", this.selectedImg  )
            this.updateRow(item, this.campanha_id)
          })
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
        this.resetValues()        
        this.imgInfo.flag = flag//garante q nao vai ter uma img pre definida ao abrir o dialog
        this.sendDefaultDates(flag)
      },
      resetValues(){
        //p dps de uma remocao, ao eu add um novo item, os campos n terem mais relacao com o que foi deletado
        this.editedItem = {
            img:  '',
            nome: '--',
            data_i: '',
            data_f: '',
            preco_v: '0,00',
            tabloide: false,
            cartaz: false,
            facebook: false,
            tvindoor: false,
            radio_interna: false,
            radio_externa: false,
            radio_externa: false,
            jornais: false,
            pov: false,
            obs: ''
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
        this.resetDateErrorStack()
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
        this.defaultDatesValues.flag = 0
        this.imgInfo.flag = 0
      },
      async save () {
        if (this.editedIndex > -1) {//na edicao, preciso editar antes do assign, se nao vou modificar uma copia q nao é mais usada
            this.editUserInputs()
            //console.log(" imgs ", this.editedItem.img)
            await this.fillImgInfo('',this.editedItem)
            this.updateRow(this.editedItem,this.campanha_id)
            Object.assign(this.itens[this.editedIndex], this.editedItem)

        } else {//caso esteja adicionando algo em vez de editando
            //crio uma campanha/demanda associada a essa(s) demanda 
            await this.createDemandaID()//cria um novo id de campanha uma unica vez, dps q demanda_id !== '', ele n chamará mais essa f
            await this.fillImgInfo(0,this.editedItem)
            this.itens.unshift(this.editedItem)//adicionar ao topo da lista, em vez de no final
            this.editUserInputs()
            const row_id = await this.addRow(this.editedItem,this.campanha_id)//na real nem precisava passa isso como arg mas foda-se
            this.editedItem._id = row_id//na real nem precisava passa isso como arg mas foda-se
        }
        //this.saveProdutos()
        this.close()      
      },
      createDate(){//pega a data atual, serve pra dizer qd uma demanda foi criada
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      return dd + '/' + mm + '/' + yyyy;
      },
      async createDemandaID(){//cria uma unica vez
      console.log("ENTRO COM ",this.campanha_id)
        if(this.campanha_id === undefined){
            this.campanha_id = await this.createCampanha({
                status: 'pendente',
                qtdade: '0',
                data_termino: this.createDate(),
                data_inicio:  this.createDate(),
                marluc: '--',
                tipos_campanhas: 'mini demanda',
                campanha: 'mini demanda criada em ' + this.createDate() ,
                empresa: '--',
                demanda: true
            })
          //id da nova campanha gerada, lembre q essa campanha é uma mini demanda       
        }
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
          //console.log("entreii com ",  this.imgInfo.imgFile, " novo ", editedItem.img.src)
          await this.imgUpload(this.cachedImgInfo.imgFile,editedItem,)
        }
        else if(this.cachedImgInfo.imgFile !== '' && newItemIndex !== ''){//caso criando algo novo  que contenha img
          await this.imgUpload(this.cachedImgInfo.imgFile, editedItem)
        }
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
        const path = item.img.name === undefined ? "" : "../../../uploads/fotos/" + item.img.name
        return path
      },
      async fetchProdutos(){
        this.itens = await this.getProdutos(this.campanha_id)///fazer campanhaInfos.produtos n funciona idealmente aqui pois ele seta o valor antes da prop ser setada ( tem a ver com sync e promises). por isso, aqui é melhor deixar assim. ja em 'concorrencia.vue', posso usar o campanha.Infos.produtos com seguranca
      },
      //RULES:
      nomeRule(v){
        if(!!v === false)
           this.inputsValidation['nome'] = false
        else
          this.inputsValidation['nome'] = true
        return !!v || "é preciso escolher um nome para o produto. "
      },
      preco_vRule(v){
        if(!!v === false)
           this.inputsValidation['preco_v'] = false
        else
          this.inputsValidation['preco_v'] = true

        return !!v || 'o preço de venda e é obrigatório'
      },
      editUserInputs(addUnit = true){//addUnit para botar o R$ e afins. quero isso pra salvar na tabela, mas nao quero isso ( addUnit = false) qd abrir uma form/dialog pra edicao
        this.editedItem.preco_v = this.parsePtBr(this.editedItem.preco_v)

        if(addUnit){
          this.editedItem.preco_v = 'R$ ' + this.editedItem.preco_v
        }
      }
    }
  }
</script>
<style>
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
  padding: 0px;
}
</style>