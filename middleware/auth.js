import cookie from 'cookie'
import {setAuthToken, resetAuthToken} from '~/utils/auth'
  
export default function ({dispatch}, context) {
  // return new Promise((resolve, reject) => {
  //   console.log("aaaaddsads")

  //   const cookies = cookie.parse(context.req.headers.cookie || '')
  //   if (cookies.hasOwnProperty('x-access-token')) {
  //   setAuthToken(cookies['x-access-token'])
  //   dispatch('auth/fetch')
  //   .then(result => {
  //     resolve(true)
  //   })
  //   .catch(error => {
  //     console.log('waeaeaew', error)                       
  //     resetAuthToken()
  //     resolve(false)
  //   })
  //   } else {
  //   console.log("aaaaddsads")
  //   resetAuthToken()
  //   resolve(false)
  //   }
  //   })
}