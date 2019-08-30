export default function ({store, redirect, route}) {

 //route.fullPath retorna o path da pag: ex /entrar, /produtos etc...
 //console.log(route.fullpath)
  const userIsLoggedIn = !!store.state.auth.user
  const userType = store.state.auth.userType
 // if(userIsLoggedIn)
   // console.log("tipo de user: ", store.state.auth.user.userType)
    //lembre, pra dividir criterios com um OR logico, faco: (criterio)|(criterio) xD
    //qq pagina que comece com essas palavras ( ou subpagina delas) serão restritras a users cadastrados
  const urlRequiresAuth = /(^\/campanhas(\/|$))|(^\/produtos(\/|$))|(^\/(\/|$))|(^\/tabloides(\/|$))|(^\/admin(\/|$))|(^\/analise(\/|$))|(^\/users(\/|$))|(^\/demandas(\/|$))/i.test(route.fullPath)//restringe qq coisa que comece com '/campanhas/'
  const urlRequiresNonAuth = /^\/login(\/|$)/.test(route.fullPath)
  //criterios pra restringir acesso a pag/subpaginas baseado no tipo de user:
  const urlForbiddenForCompradores = /(^\/admin(\/|$))|(^\/analise(\/|$))|(^\/users(\/|$))|(^\/demandas(\/|$))/i.test(route.fullPath)
  const urlForbiddenForDirector = /(^\/campanhas(\/|$))|(^\/admin(\/|$))|(^\/users(\/|$))|(^\/demandas(\/|$))/i.test(route.fullPath)
  const urlForbiddenForTabloideUser = /(^\/campanhas(\/|$))|(^\/admin(\/|$))|(^\/analise(\/|$))|(^\/users(\/|$))/i.test(route.fullPath)
  
  console.log("middleware checado (middleware/auth.js)")
  if (!userIsLoggedIn && urlRequiresAuth) {
    return redirect('/login')
  }
  if (userIsLoggedIn && urlRequiresNonAuth) {//se o doidao tiver logado e ir pra uma pag q n requer autenticacao e comece com 'login',redirecione pra pagp rincipal
    return redirect('/')
  }
  //restringe o acesso a paginas/subpaginas baseado no tipo de user
  if(userIsLoggedIn){
    console.log("logado em ", route.fullPath, " user do tipo: ", userType)
    if(userType === 'client' && urlForbiddenForCompradores){
      //console.log("vaza cliente..")
      return redirect('/')
    }
    else if(userType === 'diretor' && urlForbiddenForDirector){
     // console.log("vaza diretor..")
      return redirect('/')
    }
    else if(userType === 'tabloide' && urlForbiddenForTabloideUser){
      //console.log("vaza tablodeUser..")
      return redirect('/')
    }
  }
  return Promise.resolve()
}