const pkg = require('./package')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: 'universal',
  
  // webfontloader:{
  //   google:{
  //     families: ['Roboto:400,700']['Open Sans:400,700']['Hanalei:400,700']
  //   }
  // },  
  /*
  ** Headers of the page
  */
  head: {
    title: 'encarteDO! | Gestão de tablóides para supermercados',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.8.2/css/all.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  // router: {//esquece por hr, mas é uma solucao
  //   middleware: ['auth']
  // },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    'assets/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '~/api/init.js',
    { src: '~/plugins/imgPlugin.js', ssr: false },
    { src: '~/plugins/fontPicker.js', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
  // '@nuxtjs/axios', AINDA N
  // '@nuxtjs/auth'
  ],

  router: {
    middleware: ['auth']
  },

  //SERVER SIDE CONFIG:::: XD
  serverMiddleware: ['~/backend/index.js'],
  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
