import axios from 'axios'
//fundamental pois precisarei ler o token em cada nova requisicao. Nesse arq eu o guardo ou o deleteo
export function setAuthToken (token) {//bota o token no header das requisicoes
  axios.defaults.headers.common['x-access-token'] = token
}
export function resetAuthToken () {
//  console.log("vagabundo resetou")
  delete axios.defaults.headers.common['x-access-token']//limpa o header ( delelta)
}