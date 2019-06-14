<template>
    <div>
    <v-text-field  label="Selecione uma imagem" v-model='input'
    lazy-validation
    ></v-text-field>
    <v-btn @click="parsePtBr(input)" color="success">parse $$</v-btn>
    <v-btn @click="qtdade(input)" color="success">parse qtda</v-btn>
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
           console.log("entrada: ", input)
            if(input === '')//a principio minha logica n permite esse caso, mas n custa nada, vai q esqueci de algo...
                input = '0'
            //remover qqr coisa que nao seja numero '.' ou ','
            input = input.replace(/[^0-9.,]/gi,'')//
            input = input.replace(/[.](?=.*[,.])/g, "")//"remover qqr '.' com excecao do ultimo"
            input = input.replace(',','.')//substitui ',' por '.' ( q agora certamente será unico), pois é o formato esperado pro parsefloat
            console.log("parseflaodo input: ",input)
            input = parseFloat(input).toLocaleString('pt-BR', {
                style:'decimal',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
           
                
            console.log("input parseado: ",input)
            
            return input
        },
        qtdade(input){

            if(input === '')
                input = '0'
            input = input.replace(/[^0-9.,]/gi,'')//
            input = input.replace(/[.](?=.*[,.])/g, "")//"remover qqr '.' com excecao do ultimo"
            input = input.replace(',','.')

            console.log("input parseado QTDADE ", input)
        }
    }  
}
</script>

