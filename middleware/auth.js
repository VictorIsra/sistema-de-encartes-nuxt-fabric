export default function ({store, redirect, route}) {

 //route.fullPath retorna o path da pag: ex /entrar, /produtos etc...
 //console.log(route.fullpath)
  const userIsLoggedIn = !!store.state.auth.user
  if(userIsLoggedIn)
    console.log("tipo de user: ", store.state.auth.user.userType)
    //lembre, pra dividir criterios com um OR logico, faco: (criterio)|(criterio) xD
  const urlRequiresAuth = /(^\/campanhas(\/|$))|(^\/produtos(\/|$))|(^\/(\/|$))|(^\/tabloides(\/|$))|(^\/admin(\/|$))/i.test(route.fullPath)//restringe qq coisa que comece com '/campanhas/'
  const urlRequiresNonAuth = /^\/login(\/|$)/.test(route.fullPath)
  if (!userIsLoggedIn && urlRequiresAuth) {
    return redirect('/login')
  }
  if (userIsLoggedIn && urlRequiresNonAuth) {//se o doidao tiver logado e ir pra uma pag q n requer autenticacao e comece com 'login',redirecione pra pagp rincipal
    return redirect('/')
  }
  return Promise.resolve()
}