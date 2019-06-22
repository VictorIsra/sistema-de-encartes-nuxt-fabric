export const state = () => ({
    formInputs: '',
    produtos: '',
})
  
export const mutations = {
    set_form_inputs (store, inputs) {
        console.log("comitei form intpus: ", inputs)
        store.formInputs = inputs
    },
    set_produtos(store,inputs){
        store.produtos = inputs
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