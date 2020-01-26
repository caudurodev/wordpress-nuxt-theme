<template>
  <vue-simple-suggest
    ref="headerSearch"
    v-model="searchString"
    :list="getSuggestionList"
    :debounce="300"
    aria-label="Search"
    display-attribute="title"
    value-attribute="id"
    class="py-0 mt-2 inline"
    @select="goToLink"
  >
    <input
      id="headerSearchInput"
      autocomplete="off"
      placeholder="Search..."
      type="search"
    />
    <div slot="suggestion-item" slot-scope="{ suggestion }">
      <div
        class="font-mono text-base"
        v-html="$refs.headerSearch.displayProperty(suggestion)"
      ></div>
    </div>

    <!-- Main slot template -->
    <template slot="misc-item-above" slot-scope="{ suggestions, query }">
      <div v-if="isLoading" class="misc-item">
        <span class="font-mono">Loading...</span>
      </div>
      <!-- <div class="misc-item">
        <span class="font-mono text-base"
          >You're searching for '{{ query }}'.</span
        >
      </div> -->

      <!-- Sub-template if have any suggestions -->
      <!-- <template v-if="suggestions.length > 0">
        <div class="misc-item">
          <span class="font-mono text-base"
            >{{ suggestions.length }} suggestions are shown...</span
          >
        </div>
        <hr />
      </template> -->

      <!-- Show "No result" otherwise, if not loading new ones -->
      <div v-if="!isLoading && suggestions.length === 0" class="misc-item">
        <span class="font-mono">No results</span>
      </div>
    </template>
  </vue-simple-suggest>
</template>

<script>
import { mapGetters } from 'vuex'
import VueSimpleSuggest from 'vue-simple-suggest'

export default {
  name: 'SearchWP',
  components: {
    VueSimpleSuggest
  },
  data() {
    return {
      searchString: null,
      isLoading: null,
      isRouting: null
    }
  },
  computed: {
    ...mapGetters(['getBaseURL'])
  },
  methods: {
    getSuggestionList() {
      this.isLoading = true
      const searchResults = this.$axios.get(
        `${this.$store.getters.getBaseURL}/wp-json/wp/v2/search`,
        {
          params: {
            search: this.searchString
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      return Promise.all([searchResults])
        .then(data => {
          this.isLoading = false
          return data[0].data
        })
        .catch(error => {
          this.isLoading = false
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
        })
    },
    goToLink(e) {
      if (!e) return
      const linkType = e.type
      const parts = e.url.split('/')
      const slug = parts.pop() || parts.pop()

      console.log('goToLink', linkType, e.type)

      if (linkType === 'page') {
        this.$emit('changingRoute')
        this.searchString = null
        this.$router.push({ path: `/page/${slug}/` })
        // return `/page/${item.node.connectedObject.slug}/`
      } else if (linkType === 'post') {
        this.$emit('changingRoute')
        this.searchString = null
        this.$router.push({ path: `/post/${slug}/` })
        // return `/post/${item.node.connectedObject.slug}/`
      }
    }
  }
}
</script>
<style lang="postcss">
.vue-simple-suggest > ul {
  min-width: 300px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.vue-simple-suggest.designed {
  position: relative;
}

.vue-simple-suggest.designed,
.vue-simple-suggest.designed * {
  box-sizing: border-box;
}

.vue-simple-suggest {
  position: relative;
  box-sizing: border-box;
}

.vue-simple-suggest.designed .input-wrapper input {
  @apply w-full block p-2 mt-1 mb-1 border-none font-mono text-base leading-tight;
  transition: all 0.1s;
  transition-delay: 0.05s;
  width: 100px;
}
.vue-simple-suggest.designed.focus .input-wrapper input {
  @apply outline-none border-none  !important;
  @apply border-b-2 !important;
}

.vue-simple-suggest.designed.focus .input-wrapper input {
  @apply font-mono text-base border-2;
}

.vue-simple-suggest.designed .suggestions {
  @apply absolute font-mono text-base bg-white border mx-3;
  left: -4em;
  right: 0;
  top: 100%;
  top: calc(100% + 5px);
  opacity: 1;
  z-index: 1000;
}

.vue-simple-suggest.designed .suggestions .suggest-item {
  cursor: pointer;
  user-select: none;
  @apply font-mono text-base border-t-2;
}

.vue-simple-suggest.designed .suggestions .suggest-item,
.vue-simple-suggest.designed .suggestions .misc-item {
  @apply font-mono text-base  px-2 py-3;
}

.vue-simple-suggest.designed .suggestions .suggest-item.hover {
  @apply bg-highlight text-black font-bold;
}

.vue-simple-suggest.designed .suggestions .suggest-item.selected {
  @apply bg-highlight text-black font-bold;
}
</style>
