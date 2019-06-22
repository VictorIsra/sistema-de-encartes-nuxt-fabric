export const state = () => ({
    formInputs: '',
    produtos: '',
    filtered_protudos: ''//só os produtos relevantes pra etapa 3

})
  
export const mutations = {
    set_form_inputs (store, inputs) {
        console.log("comitei form intpus: ", inputs)
        store.formInputs = inputs
    },
    set_produtos(store,produtos){
        console.log("comitei produtos: ", produtos)
        store.produtos = produtos
    },
    set_filtered_produtos(store,filteredProdutos){//pega só os itens referentes aos produtos que sao relevantes pra etapa3
        store.filtered_protudos = filteredProdutos
        console.log("filtrados (camapnhas.js ): ", filteredProdutos)
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
    }
}