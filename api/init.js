import axios from 'axios'
import cookies from 'js-cookie'
import {setAuthToken, resetAuthToken} from '~/utils/auth'

axios.defaults.baseURL = 'http://localhost:3000/backend/'
const token = cookies.get('x-access-token')//fundamental, sem isso ele "esquece o token" dps de um refresh/nova requisicao, msm com o cookie no cliente
//mas lembre q ele só executar esse arquivo em casa req se eu usar o  nuxtServerInit
if(token){
    console.log("seu token")
    setAuthToken(token)
}    
else{
    console.log("resetou auth token init.js ou ele nao foi setado ainda xd")
    resetAuthToken()   
}     