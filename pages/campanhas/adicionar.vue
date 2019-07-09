<template>
  <div>
    <v-stepper  v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">Dados da Campanha</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 >= 2" step="2">Escolha de Produtos</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">Análise da concorrência</v-stepper-step>

      </v-stepper-header>

      <v-stepper-items>

        <v-stepper-content step="1">  
        <v-container grid-list-xs>
          <formulario @statusform="validarForm"/>
        </v-container>
          
          <div class="text-xs-right">
          <v-btn
            color="primary"
            :disabled="!form_validated"
            @click="saveFormInputs"
          >
            Próximo
          </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-container grid-list-xs>
            <escolha-produtos :campanhaInfos="campanha_infos" :campanha_id="campanha_id"/>
          </v-container>
        
          <div class="text-xs-right">
            <v-btn
              color="primary"
              @click="teste"
            ><!-- etapa 3 recebera só os inputs filtrados da etapa 2 ( inputs de interesses) -->
              Próximo
            </v-btn>
          </div>  
        </v-stepper-content>

        <v-stepper-content step="3">
      
          <v-container grid-list-xs>
            <concorrencia :flagC="concorrenceFlag" :campanha_id="campanha_id"/>
          </v-container>
            
          <div class="text-xs-right">
            <v-btn 
              color="primary"
              @click="e1 = e1"
              :disabled="1 < 2 ? true : false"
            >
              Criar campanha
            </v-btn>
          </div>
          <v-btn flat @click="e1 = e1 - 1">Voltar</v-btn>
        </v-stepper-content>
        
      </v-stepper-items>
    </v-stepper>
    
  </div>
</template>

<script>
  //import da etapa 1( slot1):
  import formulario from '../../components/campanhas/step1/formulario.vue';
  //import da etapa 2 ( step2):
  import escolhaProdutos from '../../components/campanhas/step2/EscolhaProdutos.vue'
  //impor etapa 3 ( step 3):
  import concorrencia from '../../components/campanhas/step3/concorrencia.vue'
  import crudMixin from '../../components/mixins/CRUD.js'

  export default {
    mixins: [
      crudMixin
    ],
    components: {
      formulario,
      'escolha-produtos': escolhaProdutos,
      concorrencia
    },
    created() {//mounted dá zika: ele perde o valor correto ( ou será q o mounted rola antes do data ser setado? se pa...)
      this.chooseStep()
    },
    data () {
      return {
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
      async chooseStep(){
      //baseado no id da campanha (undefined se n existir ou -1 se for criar uma campanha nova, else caso ja exista),irei setar o valor da variavel e1
      this.campanha_id = this.$route.params.campanha_id
        if(this.campanha_id === undefined || this.campanha_id === '-1')
          this.e1 = 0
        else{//caso esteja editando uma campanha ( existente obviamente)
          this.e1 = 2
          this.campanha_infos = await this.fetchCampanhas(this.campanha_id)
          console.log("campanha info etapa 2 ", this.campanha_infos)
        }  
      },
      teste(){
        this.e1 = 3
        this.concorrenceFlag = !this.concorrenceFlag//assim evito ter que usar emit e afins
        console.log("campanha info etapa 3 ", this.campanha_infos)
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
      //$store.state.auth.show_lateral_menu
      async saveFormInputs(){//cria uma campanha neste momento
        this.e1 = 2
        this.campanha_id = await this.createCampanha(this.form_inputs)
      },
    }
  }
</script>