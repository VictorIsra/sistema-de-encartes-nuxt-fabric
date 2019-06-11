<template>
  <v-container  grid-list-md> <!-- md lg6-->
    <v-layout row wrap>
      <v-flex xs1 lg6>
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
              :rules="[dataRule]"
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
              :rules="[dataRule]"
            ></v-text-field>
          </template>
          <v-date-picker v-model="data_termino" no-title @input="menu2 = false"></v-date-picker>
        </v-menu>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  export default {
    props: {
        checkDataRange: {
          type: Object,
          default: function(){
            return{
              checkRange: false,
              Pdata_i: '', //de 'parent data inicio
              Pdata_f: ''
            }  
          }
        }
    },
    data: () => ({
      data_inicio: new Date().toISOString().substr(0, 10),
      data_termino: new Date().toISOString().substr(0, 10),
      
      dateFormatted_inicio:'', //vm.formatDate(new Date().toISOString().substr(0, 10)),
      dateFormatted_termino:'',// vm.formatDate(new Date().toISOString().substr(0, 10)),
      // dataRule: [
      //   v => !!v || 'É preciso escolher uma data'
      // ],
      menu1: false,
      menu2: false
    }),
    watch: {
      data_inicio (val) {
        this.dateFormatted_inicio = this.formatDate(this.data_inicio)
        this.$emit('datachanged',{
          data: this.dateFormatted_inicio,
          flag: 0
        });

      },
      data_termino (val) {
        //console.log("antes INVOCA ", this.dateFormatted_termino)

        this.dateFormatted_termino = this.formatDate(this.data_termino)
        this.$emit('datachanged',{
          data: this.dateFormatted_termino,
          flag: 1
        });
      }
    },

    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
      
        return `${day}/${month}/${year}`//ajustado pro padrao que quero
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')//n sei qd isso e'chamado, n mexerei ainda
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      dataRange(dateFrom,dateTo,dateCheck){ //ve se a data tá entre um range
        var d1 = dateFrom.split("/")
        var d2 = dateTo.split("/")
        var c = dateCheck.split("/")
        
        var from = new Date(d1[2], parseInt(d1[1])-1, d1[0])  // -1 because months are from 0 to 11
        var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0])
        var check = new Date(c[2], parseInt(c[1])-1, c[0])
    
        console.log(check > from && check < to)
        return check > from && check < to
      },
      dataRule(v){
            if(!this.checkDataRange.checkRange)
             console.log("sou data rule e n checo range :)")
            else{//só no caso da data precisar estar entre um intervalo
              return this.dataRange(this.checkDataRange.Pdata_i,
              this.checkDataRange.Pdata_f,v) || "a data precisa estar entre " + this.checkDataRange.Pdata_i
              + " e " + this.checkDataRange.Pdata_f + "."
            }  

          return !!v || 'É preciso escolher uma data'
      }
    }
  }
</script>