export default{
    methods:{
        parsePtBr(input){
            if(input === '' || input === undefined)//a principio minha logica n permite esse caso, mas n custa nada, vai q esqueci de algo...
                input = '0,00'
            //remover qqr coisa que nao seja numero '.' ou ','
            input = input.replace(/[^0-9.,]/gi,'')//
            input = input.replace(/[.](?=.*[,.])/g, "")//"remover qqr '.' com excecao do ultimo"
            input = input.replace(',','.')//substitui ',' por '.' ( q agora certamente será unico), pois é o formato esperado pro parsefloat
            //console.log("parseflaodo input: "
            input = parseFloat(input).toLocaleString('pt-BR', {
                style:'decimal',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
            if(input === "NaN")//caso o cara passe somente  caracteres nao numéricos
                input = "0,00"
          //  console.log("input parseado: ",input)
            return input
        }
    }  
}