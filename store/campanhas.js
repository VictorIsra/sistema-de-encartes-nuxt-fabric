export const state = () => ({
    formInputs: '',
    produtos: '',
    filtered_protudos: '',//só os produtos relevantes pra etapa 3,
    filtered_demandas: ''//só os produtos relevantes pra etapa 4

})
  //apos a etapa 2, feiltrarei o produto e as demanas  q serao usadas na etapa 3 e 4 resp
export const mutations = {
    set_form_inputs (store, inputs) {
        console.log("comitei form intpus: ", inputs)
        store.formInputs = inputs
    },
    //set produtos diz respeito aos produtos todos, sem criterio/filtro
    set_produtos(store,produtos){
        console.log("comitei produtos: ", produtos)
        store.produtos = produtos
    },
    //aquivo demanadas -> adicionar.vue que chama set_filtered* 
    set_filtered_produtos(store,filteredProdutos){//pega só os itens referentes aos produtos que sao relevantes pra etapa3
        store.filtered_protudos = filteredProdutos
        console.log("filtrados (camapnhas.js ): ", filteredProdutos)
    },
    set_filtered_damandas(store,demandas){//pega só os itens referentes aos produtos que sao relevantes pra etapa3
        store.filtered_demandas = demandas
        console.log("filtrados demand (camapnhas.js ): ", demandas)
    },
    reset_campanha(store){//reseta os dados da campanha ( caso o usuario desista de uma camapanha no meio)
        store.filtered_protudos = '',
        store.produtos = '',
        store.formInputs = '',
        store.filtered_demandas = ''
        console.log("campanha resetada :)")
    }   
}
export const actions = {
    set_form_inputs({commit},inputs){
        commit('set_form_inputs',inputs)
    },
    set_produtos({commit},inputs){
        commit('set_produtos',inputs)
    },
    set_filtered_produtos({commit},filteredProdutos){
        commit('set_filtered_produtos',filteredProdutos)
    },
    set_filtered_demandas({commit}, demandas){
        commit('set_filtered_damandas',demandas)
    },
    reset_campanha({commit}){
        commit('reset_campanha')
    }
}