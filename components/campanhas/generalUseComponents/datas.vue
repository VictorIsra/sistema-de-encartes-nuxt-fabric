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
          <v-date-picker @change="caller = 0" :format="formatDate(data_inicio)" v-model="data_inicio" no-title @input="menu1 = false"></v-date-picker>
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
          <v-date-picker @change="caller = 1" v-model="data_termino" no-title @input="menu2 = false"></v-date-picker>
        </v-menu>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  export default {
    props: {
        checkDataRange: {//tabela precisa q as datas fiquem dentro de um intervalo, daí ela envia essa prop preenchida
          type: Object,
          default: function(){
            return{
              checkRange: false,
              Pdata_i: '', //de 'parent data inicio'
              Pdata_f: ''
            }  
          }
        },
        defaultDatesValues:{//pra qd abrir um dialog, as datas serem iguais as das contidas na linha de uma tabela, em vez de em branco
          type: Object,
          default: function(){
            return {
              Rdata_i: '', //de 'row data inicio'
              Rdata_f: '',
              flag: 0 //0 indica que o pai nao mandou nada, 1 indica que sim. Facilita na hora de escolher valores default
            }
          }
        }
    },
    data: () => ({
      data_inicio: new Date().toISOString().substr(0, 10),
      data_termino: new Date().toISOString().substr(0, 10),
      caller: '',//zero se for a date de inicio, 1 se for  data final. uso p saber qual delas é a caller, e usarei essa info pra passar pro pai
      dateFormatted_inicio:'', 
      dateFormatted_termino:'',
      menu1: false,
      menu2: false,
      counter: 0
    }),
    watch: {
      data_inicio (val) {
        this.dateFormatted_inicio = this.formatDate(this.data_inicio)
        this.$emit('datechanged',{
          data: this.dateFormatted_inicio,
          flag: 0
        })
      },
      data_termino (val) {
        this.dateFormatted_termino = this.formatDate(this.data_termino)
        this.$emit('datechanged',{
          data: this.dateFormatted_termino,
          flag: 1
        });
      },
      'defaultDatesValues.flag': {//me dirá qd um dialog foi aberto, daí associo a data daqui com as contidas na tabela q chamou o dialog
        handler(){
          let temp_data_i = ''
          let temp_data_f = ''
          if( this.defaultDatesValues.flag === 1){//p n auterar a prop no comp filho
            temp_data_i = this.defaultDatesValues.Rdata_i
            temp_data_f = this.defaultDatesValues.Rdata_f
            
            this.dateFormatted_inicio = temp_data_i
            this.dateFormatted_termino = temp_data_f
          }
          else{
            this.dateFormatted_inicio = ''
            this.dateFormatted_termino = ''
          }
          //sei q só precisava checar isso sempre q abre um dialog,
          //mas no mounted n rola ja q o codigo executa-o antes de, de fato, chegar na etapa 2, entao o ptei por aqui msm
          this.setDatesRange()
        }
      }
    },
    methods: {
      setDatesRange(){//seta o intervalo de datas em que os produtos devem estar ( datas form definidas na etapa 1)
        this.checkDataRange.Pdata_i = this.$store.state.campanhas.formInputs.data_inicio
        this.checkDataRange.Pdata_f = this.$store.state.campanhas.formInputs.data_termino
      },
      formatDate (date) {
        if (!date)
          return null
        const [year, month, day] = date.split('-') 
        return `${day}/${month}/${year}`//ajustado pro padrao que quero
      },
      parseDate (date) {
        if (!date) 
          return null
        const [month, day, year] = date.split('/')//n sei qd isso e'chamado, n mexerei ainda
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      dataRange(dateFrom,dateTo,dateCheck,flag){ //ve se a data tá entre um range
      //true se a data for ok( dentro do range), false caso contrário
        if(dateCheck === undefined)
          return
          
        var d1 = dateFrom.split("/")
        var d2 = dateTo.split("/")
        var c = dateCheck.split("/")
        
        var from = new Date(d1[2], parseInt(d1[1])-1, d1[0])  // -1 because (mes de 0 a 11)
        var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0])
        var check = new Date(c[2], parseInt(c[1])-1, c[0])    
        //console.log(check > from && check < to)
        var dataInRange = check >= from && check <= to
       // console.log("chamei d novo caler: ", flag)
        this.sendDateStatus(dataInRange,flag)
        return dataInRange
      },
      sendDateStatus(dataInRange,flag){//componente pai usará isso pra saber ql data é inicial e ql a final, a fim de valida-las num form/dialog
        if(!dataInRange ){//se invalido emite evento ao pai avisando. rule tb faz isso, visualmente, mas esse evento faz a nivel lógico
            this.$emit('dateStatusInfo',{
              status: 1,//1 é pq teve erro //esse stauts é dif nada tem a ver com o status do parametro
              caller: flag//caller 0 se for data inicial, caler 1 se for data final
            })
        }  
        else if(dataInRange){
          this.$emit('dateStatusInfo',{
            status: 0,//0 é pq n teve error
            caller: flag
          })
        } 
      },
      convertBoolToNumber(dataInRange){//lembre q 1 é erro ( fora do range) e 0 é q foi td ok
        return dataInRange === true ? 0 : 1
      },
      dataRule(v){   
        if(!this.checkDataRange.checkRange)
          console.log("sou data rule e n checo range :)")
        else{//só no caso da data precisar estar entre um intervalo 
          if(v !== '' && this.defaultDatesValues.flag !== -1){
            console.log("chamei f")
            var flag = this.getFlag(v)
            var status = this.dataRange(this.checkDataRange.Pdata_i,this.checkDataRange.Pdata_f,v,flag)
            return status || "a data precisa estar entre " + this.checkDataRange.Pdata_i
                              + " e " + this.checkDataRange.Pdata_f + "."
          } 
          else//funciona mas lembra q esse true indica q é valido, e n quero isso. por isso, lembre que foi fundamental checar na validacao o caso em q data vale ''
            return true     
        }  
        return !!v || 'É preciso escolher uma data'
      },
      getFlag(input){//n posso passar como argumento pra rules pq congela a f e d stack overflow sl pq (semp q eu passar uma f com mais de 1 arg pra rule rola isso o.O)...
        if(this.dateFormatted_inicio === this.dateFormatted_termino)//precisa ser a primeira condicao
          return -1
        else if(input === this.dateFormatted_inicio)
          return 0
        else if (input === this.dateFormatted_termino)
          return 1  
        
      }
    }
  }
</script>