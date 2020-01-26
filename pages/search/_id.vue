<template>
  <section class="flex flex-wrap w-full">
    <form class="w-full pr-3 mb-0" @submit.prevent="searchNewPage">
      <div class="search-input">
        <input
          v-model="searchString"
          class="w-full flex font-mono appearance-none bg-white border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight  "
          type="text"
          placeholder="Search..."
          aria-label="Search"
        />

        <button
          class="flex-shrink-0 border-transparent border-4 text-grey hover:text-black text-sm py-1 px-2 rounded"
          @click="searchNewPage"
        >
          <img src="~/assets/svg/search.svg" />
        </button>
      </div>
    </form>
    <div v-if="!$route.params.id || searchResults.length === 0" class="mt-6">
      <h2 class="search font-mono uppercase text-sm text-grey-darker">
        No search results for <b class="text-black">"{{ $route.params.id }}"</b>
      </h2>
    </div>

    <div v-if="searchResults && searchResults.length > 0" class="mt-6">
      <h2 class="search font-mono uppercase text-sm text-grey-darker">
        Search results for <b class="text-black">"{{ $route.params.id }}"</b>:
      </h2>

      <div v-for="result in searchResults" :key="result.id">
        <button class="link-style text-left" @click="goToLink(result)">
          <h3 v-html="result.title"></h3>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import gqlConfig from '~/pages/gql/config.graphql'
import { mapGetters } from 'vuex'
import LinkResolver from '~/mixins/linkResolver'

export default {
  name: 'SearchPage',
  mixins: [LinkResolver],
  data() {
    return { searchString: null }
  },
  computed: {
    ...mapGetters(['moment'])
  },
  asyncData({ store, params, $axios }) {
    const pageData = $axios.post(
      `${store.getters.getBaseURL}/graphql`,
      {
        query: gqlConfig
      },
      {
        headers: {
          // cache duration in redis in seconds
          HTTP_X_GRAPHQL_CACHE_DURATION: 60 * 60,
          HTTP_X_GRAPHQL_CACHE: 'siteconfig',
          'Content-Type': 'application/json'
        }
      }
    )
    const searchResult = store.dispatch('searchSite', params.id)
    return Promise.all([pageData, searchResult])
      .then(data => {
        let returnData = data[0].data.data
        returnData.searchResults = data[1].data
        store.commit('SET_SETTINGS', returnData.generalSettings)
        store.commit('SET_MENUS', returnData.menus)
        store.commit('SET_FOOTER', returnData.footer.gql.footer)
        return returnData
      })
      .catch(error => {
        if (error.response) {
          // Request made and server responded
          console.log('error data:', error.response.data)
          console.log('error status:', error.response.status)
          console.log('error headers:', error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error request:', error.request)
          // console.log('error request:')
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error message', error.message)
        }

        return { error: true }
        // context.redirect('/error')
      })
  },
  methods: {
    searchNewPage() {
      if (this.searchString)
        this.$router.push({
          path: `/search/${this.searchString}/`,
          id: this.searchString
        })
    }
  }
}
</script>

<style lang="postcss"></style>
