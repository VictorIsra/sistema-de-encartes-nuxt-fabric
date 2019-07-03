<template>
  <div>
    <v-stepper  v-model="e1">
    <!-- <v-btn color="success" @click="printFormInputs">CHECK INPUTS</v-btn>-->
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">Dados da Campanha</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">Escolha de Produtos</v-stepper-step>

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
            <escolha-produtos :campanhaDates="form_inputs"/>
          </v-container>
        
          <div class="text-xs-right">
            <v-btn
              color="primary"
              @click="sendFilteredProdutosInput"
            ><!-- etapa 3 recebera só os inputs filtrados da etapa 2 ( inputs de interesses) -->
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

  export default {

    components: {
      formulario,
      'escolha-produtos': escolhaProdutos,
      concorrencia
    },
    mounted() {
      console.log("valor de e: ", this.e1, " route: ", this.$route.params)
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
      //$store.state.auth.show_lateral_menu
      saveFormInputs(){
        //let inputs = Object.values(this.form_inputs)
        this.e1 = 2
        //this.$store.dispatch('campanhas/set_form_inputs',this.form_inputs)//alimenta o store com os inputs da etapa 1 das campanhas
      },
      sendFilteredProdutosInput(){//envia pra etapa 3 os inputs referentes aos produtos, mas só os q serao usados de fato na etapa 3
        this.e1 = 3
       // const produtos = this.$store.state.campanhas.produtos//produtos bases q serao fitrados pra serem usados na etapa 3 e 4
        this.filterProdutos(produtos)
        //so mandarei o flag qd a f acima terminar d executar,pra ter consistencia os dados
        this.getFilteredProdutos = !this.getFilteredProdutos

      },
      filterProdutos(produtos){
        const filtered = []//vetor com os produtos da etapa 2 filtrados
        if(produtos !== ''){//se n dá erro. mas só ocorre isso se o doidao n escolher nenhum prpduto, mas enfim. dps penso se restringo isso ou n
          produtos.forEach(p => {
            filtered.push({
              img: p.img,
              nome: p.nome,
              preco_c: p.preco_c,
              preco_v: p.preco_v,
              marluc: p.marluc,//fundamental adicionar essas propriedades ao objeto aqui se nao, ele 'funciona',mas sem getters e setters, o que fode td! xD
              preco_v_c1: 'R$ 0,00',
              preco_v_c2: 'R$ 0,00',
              preco_v_c3: 'R$ 0,00'
            })
          })
           //salva no store os produtos filtrados para pré propularem colunas da etapa3
          //this.$store.dispatch('campanhas/set_filtered_produtos',filtered)
        }     
      }
    }
  }
</script>