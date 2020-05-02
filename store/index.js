import Vue from 'vue'
import axios from 'axios'

export const state = () => ({
  settings: null,
  menus: null,
  $env: null,
  routerStatus: null,
  footer: null,
  config: null
})

export const mutations = {
  SET_SETTINGS(state, payload) {
    Vue.set(state, 'settings', payload)
  },
  SET_MENUS(state, payload) {
    Vue.set(state, 'menus', payload)
  },
  SET_ENV(state) {
    Vue.set(state, '$env', this.$env)
  },
  SET_ROUTER_STATUS(state, payload) {
    state.routerStatus = payload
  },
  SET_FOOTER(state, payload) {
    state.footer = payload
  },
  SET_SITE_CONFIG(state, payload) {
    state.config = payload
  }
}

export const getters = {
  getBaseURL: state => {
    if (
      !process.server ||
      process.env.NODE_ENV === 'development' ||
      process.env._AXIOS_BASE_URL_.includes('localhost:3000')
    ) {
      state
      // console.log('env1', state.$env)
      // console.log('env2', process.env)
      // return 'http://localhost'
      return state.$env.NUXT_ENV_BASE_URL
    }
    // request from inside docker network as node
    // return 'http://wp:80/'
    return state.$env.NUXT_ENV_WP_CONTAINER
  },
  stringToHash: () => string => {
    let hash = 0
    if (string.length == 0) return hash
    for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return `cache${Math.abs(hash)}`
  },
  siteConfig(state) {
    return state.settings
  },
  headerMenu(state) {
    const mainMenu = state.menus.nodes.filter(menu => {
      if (menu.menuName === 'main') return menu
    })
    if (mainMenu && mainMenu[0]) return mainMenu[0].menuItems.edges
  },
  headerIconsMenu(state) {
    return state.menus.nodes.filter(menu => {
      if (menu.menuName === 'headerIcons') return menu
    })[0].menuItems.edges
  },
  footerMenu(state) {
    const footerMenu = state.menus.nodes.filter(menu => {
      if (menu.menuName === 'footer') return menu
    })
    if (footerMenu && footerMenu[0] && footerMenu[0].menuItems)
      return footerMenu[0].menuItems.edges
    return []
  }
}

export const actions = {
  searchSite: ({ getters }, payload) => {
    return axios
      .get(
        `${getters.getBaseURL}/wp-json/wp/v2/search`,
        {
          params: {
            search: payload
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then(result => {
        return result
      })
      .catch(() => {
        console.log('error search site')
        return
      })
  },
  loadPage: ({ getters, commit }, { gqlFiles, redirect }) => {
    // mix all necessary GQL files to load page in one request
    const gqlRequest = getters['graphQLHelper/joinGQLFiles'](gqlFiles)

    // cached key in Redis (requires wp plugin)
    const requestCacheID = getters.stringToHash(JSON.stringify(gqlRequest))

    const pageData = axios.post(
      `${getters.getBaseURL}/graphql`,
      {
        query: gqlRequest
      },
      {
        headers: {
          // cache duration in redis in seconds
          HTTP_X_GRAPHQL_CACHE_DURATION: 60 * 60,
          HTTP_X_GRAPHQL_CACHE: requestCacheID,
          'Content-Type': 'application/json'
        }
      }
    )

    return Promise.all([pageData])
      .then(data => {
        let returnData = data[0].data.data
        if (returnData.pageBy === null) {
          console.log('null pageBy')
          throw new Error('404 page not found')
        } else if (returnData.postBy === null) {
          console.log('null postBy')
          throw new Error('404 post not found')
        } else {
          commit('SET_SETTINGS', returnData.generalSettings)
          commit('SET_MENUS', returnData.menus)
          if (returnData.siteConfig && returnData.siteConfig.gql) {
            commit('SET_FOOTER', returnData.siteConfig.gql.footer)
          }
          commit('SET_SITE_CONFIG', returnData.generalSettings)
          return returnData
        }
      })
      .catch(err => {
        if (err.response) {
          // Request made and server responded
          // console.log('err data:', err.response.data)
          // console.log('err status:', err.response.status)
          // console.log('err headers:', err.response.headers)
        } else if (err.request) {
          // The request was made but no response was received
          // console.log('err request:', err.request)
          // console.log('err request:')
        } else {
          // Something happened in setting up the request that triggered an err
          // console.log('err message index', err.message)
        }
        redirect('/error')
      })
  },
  async nuxtServerInit({ commit }) {
    commit('SET_ENV')
  },
  updateRouterTransitionStatus: ({ commit }, payload) => {
    commit('SET_ROUTER_STATUS', payload)
  }
}
