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
    filter_produtos(store,produtos){//pega só os itens referentes aos produtos que sao relevantes pra etapa3
        produtos.forEach(p => console.log(p))
    }
}
export const actions = {
    set_form_inputs({commit},inputs){
        commit('set_form_inputs',inputs)
    },
    set_produtos({commit},inputs){
        commit('set_produtos',inputs)
    }

}