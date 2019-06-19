import api from '~/api'//pra eu poder fazer as req pro axios com uma sintaxe enxugada
//em vez de escrever a req aqui, escrevi em ~/api e só chamo como um objeto nesse arquivo: ex api.auth.login é um post pro meu bd, mas essa sintax é mt mais enxuta
import {setAuthToken, resetAuthToken} from '~/utils/auth'//pode setar/deletar o token do header
import cookies from 'js-cookie'//js-cookie lida com cookies no cliente side

export const state = () => ({
    user: null//vai guardar um objeto, que é meu user. nesse objeto terei o id,nome, tipo de user etc
  })
  
  export const mutations = {
    set_user (store, data) {
      console.log("SETANDO para: ", data)
      store.user = data
    },
    reset_user (store) {
      console.log("RESETAND BADA")
      store.user = null
    }
  }
  
  export const actions = {
    fetch ({commit}) {
      return api.auth.me()
        .then(response => {
          console.log("RESPOSTAS ANTES DO COMMIT: response.data: " , response.data ,
          " response.data.result: " , response.data.result, " response: ", response)
          commit('set_user', response.data.user)


         // console.log("tudo azuul: ", response.data.result)
          return response
        })
        .catch(error => {
          console.log("acho algum erro e resetou o.o")
          commit('reset_user')
          return error
        })
    },
    login ({commit}, data) {//printa output aqui mas nao no bd em si..lol
      return api.auth.login(data)
        .then(response => {
          commit('set_user', response.data.user)//seto a variavel de state 'user' como o objeto resposta
          console.log("res do logi ", response.data.user)
          console.log("tipo de resposta no login: ", typeof(response.data.user))
          setAuthToken(response.data.token)//coloco o token no header de todas as req
          cookies.set('x-access-token',response.data.token)//guardo o token num cookie do lado do cliente
          return response
        }).catch(e => console.log("nada" +e))

        
    },
    reset ({commit}) {
      console.log("toma no cu, resetei")
      commit('reset_user')
      resetAuthToken()//limpo o token dos headers
      cookies.remove('x-access-token')//delete o cookie com o token
      return Promise.resolve()
    }
  }