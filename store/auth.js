import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada
//em vez de escrever a req aqui, escrevi em ~/api e só chamo como um objeto nesse arquivo: ex api.auth.login é um post pro meu bd, mas essa sintax é mt mais enxuta
import {setAuthToken, resetAuthToken} from '~/utils/auth'//pode setar/deletar o token do header
import cookies from 'js-cookie'//js-cookie lida com cookies no cliente side

export const state = () => ({
    user: null,//vai guardar um objeto, que é meu user. nesse objeto terei o id,nome, tipo de user etc
    show_lateral_menu: true //só nas pag n existentes q quero q esse menu n apareça ( seja false)
    //logo, no arquivo error.vue eu commito isso pra falso atraves de uma action, mas, em todo resto, será true ;D
  })
  
  export const mutations = {
    set_user (store, data) {
      store.user = data
    },
    reset_user (store) {
      store.user = null
    },
    set_menu_status(store,status){
      store.show_lateral_menu = status
    }
  }
  
  export const actions = {
    show_menu({commit},status){
      commit('set_menu_status',status)
    },
    fetch ({commit}) {
      console.log("me chamaram")
      return api.auth.me()
        .then(response => {
          
          commit('set_user', response.data.user)


         // console.log("tudo azuul: ", response.data.result)
          return response
        })
        .catch(error => {
          commit('reset_user')
          return error
        })
    },
    login ({commit}, data) {//printa output aqui mas nao no bd em si..lol
      return api.auth.login(data)
        .then(response => {
          commit('set_user', response.data.user)//seto a variavel de state 'user' como o objeto resposta
          setAuthToken(response.data.token)//coloco o token no header de todas as req
          cookies.set('x-access-token',response.data.token)//guardo o token num cookie do lado do cliente
          return response
        }).catch(e => console.log("nada" +e))

        
    },
    logout ({commit},data) {
      return api.auth.logout(data)
      .then(response => {
        commit('reset_user')

        resetAuthToken()//limpo o token dos headers
        cookies.remove('x-access-token')//delete o cookie com o token
      }).catch(e => console.log("logout falhou: ", e))
    }
  }