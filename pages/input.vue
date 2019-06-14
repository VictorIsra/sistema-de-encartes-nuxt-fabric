<template>
    <div>
    <v-text-field  @blur="parsePtBr(input)" label="Selecione uma imagem" v-model='input'
    lazy-validation
    ></v-text-field>
    <v-btn color="success">parse</v-btn>
    <p>{{valor}}</p>
    <p>{{input}}</p>
    </div>
</template>


<script>
export default {
    data: () => ({
          valor: '',
          input: ''
    }),
    methods:{
        parsePtBr(input){
            console.log("input: ", input)
            //remover qqr coisa que nao seja numero '.' ou ','
           
            input = input.replace(/[^0-9.,]/gi,'')//  //\D/g
            this.input = input

            input = input.replace(',','.')
            console.log("removendo caracter ", input)
            //console.log("parseflaodo input: "
            let val = parseFloat(input).toLocaleString('pt-BR', {
                style:'decimal',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
            console.log("apos td ", val)
            this.valor = val
        }
    }  
}
</script>

