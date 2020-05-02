const pkg = require('./package')
const path = require('path')
require('dotenv').config()
const axios = require('axios')

module.exports = {
  mode: 'universal',

  generate: {
    async routes() {
      const baseURL = `http://localhost/wp-json/`
      console.log('baseURL', baseURL)
      let routes = ['/']

      // all posts
      // wp-json/wp/v2/posts/
      // each post
      // wp-json/wp/v2/posts/slug

      // all pages
      // wp-json/wp/v2/pages/
      // each post
      // wp-json/wp/v2/pages/slug

      // get all posts and pages and render
      console.log('get', `${baseURL}wp/v2/posts/`)
      await axios.get(`${baseURL}wp/v2/posts/`).then(res => {
        res.data.map(post => {
          routes.push('/post/' + post.slug)
        })
      })

      await axios.get(`${baseURL}wp/v2/pages/`).then(res => {
        res.data.map(page => {
          routes.push('/pages/' + page.slug)
        })
      })

      console.log('routes', routes)
      return routes
    }
  },

  /*
   ** Custom router config
   */
  router: {
    linkActiveClass: 'active-link',
    middleware: 'routeStatus'
  },

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: './favicon.png' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#509EFF' },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/tailwind.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/plugins.js'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    [
      'nuxt-env',
      {
        keys: [
          'BASE_URL',
          'WP_CONTAINER',
          'HOSTNAME',
          { key: 'OTHER_ENV_VAR', default: process.env.BASE_URL },
          { key: 'THIRD_ENV_VAR', secret: true },
          { key: 'ANOTHER_ENV_VAR', default: process.env.NUXT_ENV_BASE_URL }
        ]
      }
    ],
    'nuxt-purgecss'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  // env: {
  //   baseUrl: process.env.BASE_URL,
  //   WpContainer: process.env.WP_CONTAINER
  // },

  /*
   ** Build configuration
   */
  purgeCSS: {},
  build: {
    /*
     ** You can extend webpack config here
     */
    extractCSS: true,
    postcss: {
      plugins: {
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        cssnano: {
          preset: 'default',
          discardComments: { removeAll: true },
          zIndex: false
        }
      },
      // Change the postcss-preset-env settings
      preset: {
        stage: 0, // enable all (experimental) polyfills
        autoprefixer: {
          cascade: false,
          grid: true
        }
      }
    },
    extend(config, ctx) {
      // graphql loader
      config.module.rules.push({
        test: /\.graphql?$/,
        loader: 'webpack-graphql-loader',
        exclude: /(node_modules)/
      })
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
