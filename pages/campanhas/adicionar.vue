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
         <formulario @statusform="validarForm"/>
       </v-container>
        

        <v-btn
          color="primary"
          :disabled="!form_validated"
          @click="e1 = 2"
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
        form_validated: false,
        form_inputs: ''//componente filho formulario irá preencher isso na hora correta
      }
    },
    methods: {
      validarForm(data){
        if(data.valid){
          this.form_validated = true
          this.form_inputs = data.inputs
          this.printFormInput()
        }
        else{
          this.form_validated = false
        }
      },
      printFormInput(){
        let inputs = Object.values(this.form_inputs)
        console.log("inputs: ", inputs)
      }
    }
  }
</script>