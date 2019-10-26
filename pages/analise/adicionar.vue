<template>
  <div>
    <v-card-title primary-title class="justify-center">
      <div>
        <v-tooltip bottom>
        <template v-slot:activator="{ on }">
        <v-btn v-on="on" to="/analise" color="primary">voltar para análise de campanhas</v-btn>
        </template>
        <span span class="subheading">Voltar para painel de análise das campanhas</span>
        </v-tooltip>
      </div> 
    </v-card-title>
    <v-stepper  v-model="e1">
      <v-stepper-header>

        <v-stepper-step :complete="e1 >= 2" step="2">Escolha de Produtos</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 >= 3" step="3">Análise da concorrência</v-stepper-step>
         
        <v-divider></v-divider>

        <v-stepper-step step="4">Criação de demandas</v-stepper-step> 


      </v-stepper-header>

      <v-stepper-items>
  <v-card-title v-if="campanha_infos !== '' && e1 > 0" primary-title class="justify-center primary">
          <div>
            <span class="white--text font-weight-black caption">Empresa: <span>{{campanha_infos.empresa}} </span> <v-divider vertical></v-divider> Campanha: <span> {{campanha_infos.campanha}} </span> <v-divider vertical></v-divider> Tipo: <span> {{campanha_infos.tipos_campanhas}} </span> <v-divider vertical></v-divider> Data de início: <span> {{campanha_infos.data_inicio}} </span> <v-divider vertical></v-divider> Data de término: <span> {{campanha_infos.data_termino}} </span><v-divider vertical></v-divider>  Margem de lucro mínima: <span> {{campanha_infos.marluc}} </span></span>  
          </div>
    </v-card-title>
        <v-stepper-content step="2">
          <v-container grid-list-xs>
            <escolha-produtos  :campanhaInfos="campanha_infos" :campanha_id="campanha_id" @produtoQtdadeChange="produtoQtdadeChange"/>
          </v-container>
        
          <div class="text-xs-right">
            <v-tooltip bottom>
            <template v-slot:activator="{ on }">
            <v-btn v-on="on" to="/analise" color="primary">voltar para análise de campanhas</v-btn>
            </template>
            <span span class="subheading">Voltar para painel de análise das campanhas</span>
            </v-tooltip>
            <v-btn
              color="primary"
              @click="changeFlag"
            ><!-- etapa 3 recebera só os inputs filtrados da etapa 2 ( inputs de interesses) -->
              Próximo
            </v-btn>
          </div>  
        </v-stepper-content>

        <v-stepper-content step="3">
      
          <v-container grid-list-xs>
            <concorrencia :campanhaInfos="campanha_infos" :flagC="concorrenceFlag" :campanha_id="campanha_id" :produtosQtdadeInfo="produtosQtdadeInfo"/>
          </v-container>
            
          <div class="text-xs-right">
            <v-tooltip bottom>
            <template v-slot:activator="{ on }">
            <v-btn v-on="on" to="/analise" color="primary">voltar para análise de campanhas</v-btn>
            </template>
            <span span class="subheading">Voltar para painel de análise das campanhas</span>
            </v-tooltip>
            <v-btn color="primary" @click="e1 = e1 - 1">Voltar para escolha de produtos</v-btn>
           <v-btn 
              color="primary"
              @click="changeFlag"
            >
             Próximo
            </v-btn>
          </div>
        </v-stepper-content>

       <v-stepper-content step="4">
      
          <v-container grid-list-xs>
            <demandas :campanhaInfos="campanha_infos" :flagC="concorrenceFlag" :campanha_id="campanha_id" :produtosQtdadeInfo="produtosQtdadeInfo"/>
          </v-container>
            
          <div class="text-xs-right">
            <v-btn color="primary" @click="e1 = e1 - 1">Voltar para análise da concorrência</v-btn>
            <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on"
                color="success"
                @click="enviarDemandas"
              >
                Enviar demandas
              </v-btn>
            </template>
            <span span class="subheading">Enviar essa campanha e suas demandas para o painel de demandas</span>
            </v-tooltip>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

  </div>
  
</template>

<script>
  //import da etapa 1( slot1):
  import formulario from '../../components/demandaDiretor/step1/formulario.vue';
  //import da etapa 2 ( step2):
  import escolhaProdutos from '../../components/demandaDiretor/step2/EscolhaProdutos.vue'
  //impor etapa 3 ( step 3):
  import concorrencia from '../../components/demandaDiretor/step3/concorrencia.vue'
  //impor etapa 4 ( step 4):
  import demandas from '../../components/demandaDiretor/step4/demandas.vue'
  
  import crudMixin from '../../components/mixins/CRUD.js'

  export default {
    mixins: [
      crudMixin
    ],
    components: {
      formulario,
      'escolha-produtos': escolhaProdutos,
      concorrencia,
      demandas
    },
    created() {//mounted dá zika: ele perde o valor correto ( ou será q o mounted rola antes do data ser setado? se pa...)
      this.chooseStep()
    },
    data () {
      return {
        produtosQtdadeInfo: undefined, //alimentada pela escolahdeprodutos.vue pra ser usada em concorrencia.vue, store pra que, né? xD
        redirect: true,//semp q e1 = 0, ou seja, ainda n tiver registrado a campanha, irei redirecionar pra pag de listagens, a n ser que explicitamente eu tenha chegado a e1 = 0 via 'add nova campanha', q nesse caso redirect sera enviado como false
        concorrenceFlag: false,
        e1: 0,
        form_validated: false,//controla se o botao de 'proximo' ficará habilitado ou nao
        form_inputs: {},//componente filho (formulario.vue) irá preencher isso na hora correta
        getFilteredProdutos: false,//avisa ao step 3 (componente filgo concorrencia.vue) q ele deve alimentar a tabela com os valores dos produtos da etapa 2 filtrados
        campanha_id: undefined,//será preenchido via route.params no mounted
        campanha_infos: ''//virá do bd
      }
    },
    methods: {
      async enviarDemandas(){//evia demandas associada a campanha pro painel de demandas
        await this.updateStatus(this.campanha_id,this.campanha_infos.status,true)
        this.$router.push('/demandas') 
      },
      produtoQtdadeChange(data){
        this.produtosQtdadeInfo = data//vem da etapa 2 ( escolhaprodutps.vue) e alimentará etapa 3 ( concorrencia.vue)
      },
      async chooseStep(){
      //baseado no id da campanha (undefined se n existir ou -1 se for criar uma campanha nova, else caso ja exista),irei setar o valor da variavel e1
      this.campanha_id = this.$route.params.campanha_id
        if(this.campanha_id === undefined || this.campanha_id === '-1'){
          this.e1 = 0
        }  
        else{//caso esteja editando uma campanha ( existente obviamente)
          this.e1 = 2
          this.campanha_infos = await this.fetchCampanhas(this.campanha_id)
        }
        this.checkRedirect()//irei redireciona pra pag de listagem de campanha caso e1 = 0 e directed = true
      },
      checkRedirect(){
        if(this.e1 === 0 && this.$route.params.redirect === false)
          this.redirect = false
        if(this.redirect && this.e1 === 0)//se ainda assim for true, redireciono pra pag de listagem: ex caso de f5   
          this.$router.push('/analise') 
      },
      changeFlag(){
        //this.e1 = 3
        this.e1 ++
        this.concorrenceFlag = !this.concorrenceFlag//assim evito ter que usar emit e afins
      },
      validarForm(flag,inputs){
        if(flag){//inputs passados no componete formulario.vue sao validos, logo habilite o botao de 'proximo' neste componente (adcionar.vue)
          this.form_validated = true
          this.form_inputs = inputs
        }  
        else{
          this.form_validated = false
        }
      },
      async saveFormInputs(){//cria uma campanha neste momento
        this.e1 = 2
        this.campanha_id = await this.createCampanha(this.form_inputs)
        this.campanha_infos = await this.fetchCampanhas(this.campanha_id)//garente q td vai funcionar corretamente msm sem ter que voltar pra pag inciial ( escolha de campanhas xD)
      },
    }
  }
</script>