export default{
    methods:{
        parsePtBr(price){
            let val = (price/1).toFixed(2).replace('.', ',')
            console.log("antes do tolocalestring")
            return parseFloat(val).toLocaleString('pt-BR', {
                style:'decimal',
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
        }
    }
}