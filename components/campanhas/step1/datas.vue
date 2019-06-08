<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 lg6>
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateFormatted_inicio"
              label="DATA DE INÍCIO:"
              persistent-hint
              prepend-icon="event"
              readonly
              v-on="on"
              :rules="dataRule"
            ></v-text-field>
          </template>
          <v-date-picker :format="formatDate(data_inicio)" v-model="data_inicio" no-title @input="menu1 = false"></v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs12 lg6>
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateFormatted_termino"
              label="DATA DE TÉRMINO"
              persistent-hint
              prepend-icon="event"
              readonly
              v-on="on"
              :rules="dataRule"
            ></v-text-field>
          </template>
          <v-date-picker v-model="data_termino" no-title @input="menu2 = false"></v-date-picker>
        </v-menu>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Vue from 'vue';
  import VeeValidate from 'vee-validate';
 
Vue.use(VeeValidate);

  export default {
    data: vm => ({
      data_inicio: new Date().toISOString().substr(0, 10),
      data_termino: new Date().toISOString().substr(0, 10),

      dateFormatted_inicio: vm.formatDate(new Date().toISOString().substr(0, 10)),
      dateFormatted_termino: vm.formatDate(new Date().toISOString().substr(0, 10)),
      dataRule: [
        v => !!v || 'É preciso escolher uma data'
      ],
      menu1: false,
      menu2: false
    }),

    watch: {
      data_inicio (val) {
        this.dateFormatted_inicio = this.formatDate(this.data_inicio)
      },
      data_termino (val) {
        this.dateFormatted_termino = this.formatDate(this.data_termino)
      }
    },

    methods: {
      formatDate (date) {
        if (!date) return null

        //console.log("data: ",date)
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`//ajustar pro padrao que quero
      },
      parseDate (date) {
        if (!date) return null

       // console.log("PARdata: ",date)
        const [month, day, year] = date.split('/')//n sei qd isso e'chamado, n mexerei ainda
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }
  }
</script>