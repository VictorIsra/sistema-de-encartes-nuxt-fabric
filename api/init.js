import axios from 'axios'
import cookies from 'js-cookie'
import {setAuthToken, resetAuthToken} from '~/utils/auth'

if(process.env.NODE_ENV == 'production')
    axios.defaults.baseURL = 'http://35.194.25.104/backend/'
else
    axios.defaults.baseURL = 'http://localhost:3000/backend/'
    
const token = cookies.get('x-access-token')//fundamental, sem isso ele "esquece o token" dps de um refresh/nova requisicao, msm com o cookie no cliente
//mas lembre q ele só executar esse arquivo em casa req se eu usar o  nuxtServerInit
if(token){
    setAuthToken(token)
}    
else{
    resetAuthToken()   
}     