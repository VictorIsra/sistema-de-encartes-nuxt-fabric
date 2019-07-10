<template>
<v-flex xs10> 
  <v-card >
    <v-card-title primary-title class="justify-center">
          <div>
            <h3 class="title font-weight-regular primary--text">Novo usuário:</h3>
          </div>
      </v-card-title>
      <v-divider class="title font-weight-regular primary--text"></v-divider>
      <v-form v-model="valid" ref="form">
        <v-container>
          <v-layout class="justify-center">
            <v-flex xs12 md3>
              <v-text-field
                v-model.trim="nome"
                :rules="nameRules"
                label="Nome"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field
                v-model.trim="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field
                v-model.trim="empresa"
                :rules="nameRules"
                label="Empresa"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

            <v-layout class="justify-center">
            <v-flex xs10 md3>
              <v-text-field
                v-model.trim="login"
                :rules="nameRules"
                label="Usuário/login"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs10 md3>
              <v-text-field
                v-model.trim="password"
                :rules="[passwordRule]"
                label="Senha"
                :type="show1 ? 'text' : 'password'"
                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                @click:append="show1 = !show1"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs10 md3 >
              <v-select
                v-model="userType"
                :items="userTypes"
                :rules="[v => !!v || 'É preciso escolher um tipo de usuário']"
                label="Tipo de usuário"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout class="justify-center">
              <v-btn color="primary"  round @click="validate">Cadastrar usuário</v-btn>
          </v-layout>  
        </v-container>
      </v-form>
       <v-card-title v-if="msg !== ''" primary-title class="justify-center" :class="{'success': color === 'sucess','red': color !== 'sucess'}">
          <div >
            <h3 class="title font-weight-regular white--text ">{{msg}}</h3>
          </div>
      </v-card-title>
   </v-card> 
</v-flex>
</template>

<script>
  import userMixin from '../components/mixins/userCRUD.js'
  
  export default {
    mixins:[
      userMixin
    ],
    data: () => ({
      valid: false,
      msg:'',
      color: '',
      show1: false,//mostrar/esconder senha. por default, esconde
      userTypes: [//opções de tipo de user
        'administrador',
        'tabloide',
        'comprador',
        'diretor',
      ],
      userType: '',
      login: '',
      nome: '',
      password: '',
      email: '',
      empresa:'',
      nameRules: [
        v => !!v || 'Este campo é obrigatório'
      ],
      emailRules: [
        v => !!v || 'O campo de E-mail é obrigatório.',
        v =>  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Entre com um E-mail váido.'
      ]
    }),
    methods:{
      passwordRule(v){
        if(!v) 
          return 'Este campo é obrigatório'
        else if(this.password.length < 6)   
          return 'A senha deve ter ao menos 6 dígitos'
        else{
          return true
        }    
      },
      async validate () {//validação bem simples, sem muita frescura, já que é um form mttt simples
        if(this.$refs.form.validate()) {
            let output = ''
            output = await this.registrar({
            userType: this.userType,
            login: this.login,
            name: this.nome,
            password: this.password,
            email: this.email,
            empresa: this.empresa
          })
          this.msg = output.msg
          this.color = output.status
        }
        else
          console.log("invalido")
      },
    }
  }
</script>