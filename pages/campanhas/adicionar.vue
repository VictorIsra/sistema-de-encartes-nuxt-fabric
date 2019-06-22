<template>
  <v-stepper  v-model="e1">
   <!-- <v-btn color="success" @click="printFormInputs">CHECK INPUTS</v-btn>-->
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Dados da Campanha</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Escolha de Produtos</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">Análise da concorrência</v-stepper-step>

       <v-divider></v-divider>

      <v-stepper-step step="4">Criação das Demandas</v-stepper-step>
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
           <escolha-produtos :campanhaDates="form_inputs"/>
        </v-container>
       
        <div class="text-xs-right">
          <v-btn
            color="primary"
            @click="sendPartialProdutosInput"
          >
            Próximo
          </v-btn>
        </div>  
      </v-stepper-content>

      <v-stepper-content step="3">
    
         <v-container grid-list-xs>
           <concorrencia :getFilteredProdutos="getFilteredProdutos"/>
        </v-container>
          
        <div class="text-xs-right">
          <v-btn
            color="primary"
            @click="e1 = 4"
          >
            Próximo
          </v-btn>
        </div>
        <v-btn flat @click="e1 = e1 - 1">Voltar</v-btn>
      </v-stepper-content>
      
      <v-stepper-content step="4">
        <v-card
          class="mb-5"
          color="grey lighten-1"
          height="200px"
        ></v-card>

        <v-btn
          color="primary"
          @click="e1 = 3"
        > 
          Cadastrar campanha
        </v-btn>

        <v-btn flat @click="e1 = e1 - 1">Voltar</v-btn>
     
      </v-stepper-content>
      
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  //import da etapa 1( slot1):
  import formulario from '../../components/campanhas/step1/formulario.vue';
  //import da etapa 2 ( step2):
  import escolhaProdutos from '../../components/campanhas/step2/EscolhaProdutos.vue'
  //impor etapa 3 ( step 3):
  import concorrencia from '../../components/campanhas/step3/concorrencia.vue'

  export default {

    components: {
      formulario,
      'escolha-produtos': escolhaProdutos,
      concorrencia
    },
    data () {
      return {
        e1: 0,
        form_validated: false,//controla se o botao de 'proximo' ficará habilitado ou nao
        form_inputs: {},//componente filho (formulario.vue) irá preencher isso na hora correta
        getFilteredProdutos: false//avisa ao step 3 (componente filgo concorrencia.vue) q ele deve alimentar a tabela com os valores dos produtos da etapa 2 filtrados
      }
    },
    methods: {
      validarForm(flag,inputs){
        if(flag){//inputs passados no componete formulario.vue sao validos, logo habilite o botao de 'proximo' neste componente (adcionar.vue)
          this.form_validated = true
          this.form_inputs = inputs
        }  
        else{
          this.form_validated = false
        }
      },
      saveFormInputs(){
        //let inputs = Object.values(this.form_inputs)
        this.e1 = 2
        this.$store.dispatch('campanhas/set_form_inputs',this.form_inputs)
        console.log("inputs: ", this.$store.state.campanhas.formInputs)
      },
      sendPartialProdutosInput(){//envia pra etapa 3 os inputs referentes aos produtos, mas só os q serao usados de fato na etapa 3
        this.e1 = 3
        console.log("inputs completo ", this.$store.state.campanhas.produtos[0])
        this.getFilteredProdutos = !this.getFilteredProdutos
        console.log("Muedei valor do get bllab ", this.getFilteredProdutos)
      }
    }
  }
</script>