<template>
<v-flex xs10> 
  <v-card >
    <v-card-title primary-title class="justify-center">
          <div>
            <h3 class="title font-weight-regular primary--text">Cadastrando novo usuário</h3>
          </div>
      </v-card-title>
      <v-divider class="title font-weight-regular primary--text"></v-divider>
      <v-form v-model="valid">
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
                label="Login"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs10 md3>
              <v-text-field
                v-model.trim="password"
                :rules="nameRules"
                label="Senha"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field
                v-model.trim="passwordCheck"
                :rules="nameRules"
                label="Confirmar senha"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout class="justify-center">
            <v-flex  sm6>
              <v-select
                v-model="userType"
                :items="userTypes"
                :rules="[v => !!v || 'É preciso escolher um tipo de usuário']"
                label="Tipo de usuário"
                required
              ></v-select>
            </v-flex>
            <v-btn color="primary" top round >Cadastrar usuário</v-btn>
          </v-layout>  
        </v-container>
      </v-form>
   </v-card> 
</v-flex>
</template>

<script>
  export default {
    data: () => ({
      valid: false,
      userTypes: [
        'administrador',
        'tabloide',
        'comprador',
        'diretor',
      ],
      userType: '',
      login: '',
      nome: '',
      password: '',
      passwordCheck: '',//confirmar senha
      email: '',
      empresa:'',
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'O campo de E-mail é obrigatório.',
        v => /.+@.+/.test(v) || 'Entre com um E-mail váido.'
      ]
    })
  }
</script>