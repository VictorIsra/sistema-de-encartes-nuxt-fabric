import cookie from 'cookie'
import {setAuthToken, resetAuthToken} from '~/utils/auth'
export const strict = false//com isso, nao rola o erro de 'n mudar mutation without mutatiom handler e mimimi'

export const actions = {
  nuxtServerInit ({dispatch, router}, context) {

    return new Promise((resolve, reject) => {
      const cookies = cookie.parse(context.req.headers.cookie || '')
      if (cookies.hasOwnProperty('x-access-token')) {
        setAuthToken(cookies['x-access-token'])
        dispatch('auth/fetch')
          .then(result => {
            //garantir q sempre vou poder acessar o tipo de user em default.vue pra saber quais menus mostrar/esconder
            dispatch('auth/set_user_type', result.data.user.userType)
            resolve(true)
          })
          .catch(error => {
            console.log('erro ao tentar auth/fetch no store: index.js ', error)
            router.push('/')                       
            resetAuthToken()
            resolve(false)
          })
      } else {
        resetAuthToken()
        resolve(false)
      }
    })
  }
}