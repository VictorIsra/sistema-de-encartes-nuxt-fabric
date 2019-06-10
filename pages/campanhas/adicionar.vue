<template>
  <v-stepper  v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Dados da Campanha</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Escolha de Produtos</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3">Aprovação do Diretor</v-stepper-step>

       <v-divider></v-divider>

      <v-stepper-step step="4">Criação das Demandas</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>

      <v-stepper-content step="1">  
       <v-container grid-list-xs>
         <formulario @statusform="validarForm" @getinputs="getFormInputs" :send_form_data="send_form_data"/>
       </v-container>
        

        <v-btn
          color="primary"
          :disabled="!form_validated"
          @click="send_form_data = true"
        >
          Próximo
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-container grid-list-xs>
           <tabela-produtos/>
        </v-container>
       

        <v-btn
          color="primary"
          @click="e1 = 3"
        >
          Próximo
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-5"
          color="grey lighten-1"
          height="200px"
        ></v-card>

        <v-btn
          color="primary"
          @click="e1 = 4"
        >
          Próximo
        </v-btn>

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
  import tabelaProdutos from '../../components/campanhas/step2/tabelaProdutos.vue'

  export default {

    components: {
      formulario,
      'tabela-produtos': tabelaProdutos
    },
    data () {
      return {
        e1: 0,
        form_validated: false,//controla se o botao de 'proximo' ficará habilitado ou nao
        form_inputs: '',//componente filho (formulario.vue) irá preencher isso na hora correta
        send_form_data: false //prop/flag para avisar ao componente filho ( formulario.vue) que ele pode retornar os inputs passados pelo user
      }
    },
    methods: {
      validarForm(flag){
        if(flag)//inputs passados no componete formulario.vue sao validos, logo habilite o botao de 'proximo' neste componente (adcionar.vue)
          this.form_validated = true
        else{
          this.form_validated = false
        }
      },
      getFormInputs(inputs){//ao validar o form, o botao de prox ficara ativado e, ao clicar nele, os inputs serao passados pra cá
       this.form_inputs = inputs
       this.e1 = 2
       this.printFormInputs()
      },
      printFormInputs(){
        let inputs = Object.values(this.form_inputs)
        console.log("inputs: ", inputs)
      }
    }
  }
</script>