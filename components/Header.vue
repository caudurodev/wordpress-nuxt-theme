<template>
  <div>
    <div class="z-20 site-header bg-white fixed w-full border-b">
      <nav class="z-30 site-header flex flex-wrap justify-between ">
        <div class="flex items-center ml-8">
          <nuxt-link class="siteTitle" to="/">
            <img :alt="siteConfig.title" :src="config.sitelogo.sourceUrl" />
          </nuxt-link>
          <!-- desktop navigation main menu -->
          <div v-if="$mq === 'lg' || $mq === 'xl'">
            <nuxt-link
              v-for="menuItem in headerMenu"
              :key="menuItem.node.id"
              :to="openMenu(menuItem)"
              class="mr-6 nav-links"
            >
              {{ menuItem.node.label }}
            </nuxt-link>
          </div>
        </div>
        <!-- desktop icons right header -->
        <div v-if="$mq === 'lg' || $mq === 'xl'" class="flex flex-row">
          <div class="flex flex-wrap">
            <transition name="fade">
              <div v-if="showSearch" class="mt-2">
                <SearchWP @changingRoute="showSearch = false"></SearchWP>
              </div>
            </transition>
            <transition name="fadeloader" mode="out-in">
              <div
                v-if="!showSearch && routerStatus === 'out'"
                class="mt-5 mr-2"
              >
                <Loader></Loader>
              </div>
            </transition>
            <button class="social-link border-none" @click="toggleSearch()">
              <img src="~/assets/svg/search.svg" />
            </button>
          </div>
          <div v-for="menuItem in headerIconsMenu" :key="menuItem.node.id">
            <a
              :href="menuItem.node.url"
              :title="menuItem.node.label"
              class="social-link"
            >
              <img
                v-if="menuItem.node.icon.icon"
                :src="menuItem.node.icon.icon.sourceUrl"
              />
            </a>
          </div>
        </div>
        <div
          v-if="$mq === 'sm' || $mq === 'md'"
          style="transform: scale(0.6); opacity:0.8;"
        >
          <button
            :class="{ 'is-active': showMobileNav }"
            class=" hamburger hamburger--minus"
            type="button"
            aria-label="Menu"
            aria-controls="navigation"
            @click="
              showMobileNav = !showMobileNav
              showSearch = false
            "
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </nav>
    </div>

    <!-- mobile nav main menu -->
    <transition name="slidedown">
      <div
        v-if="($mq === 'sm' || $mq === 'md') && showMobileNav"
        class="mobile-nav "
      >
        <form class="w-full mb-0 bg-white" @submit.prevent="searchNewPage">
          <div class="search-input  ">
            <input
              v-model="searchString"
              class="w-full px-6 flex font-mono appearance-none bg-white border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight  "
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

        <nuxt-link
          v-for="menuItem in headerMenu"
          :key="menuItem.node.id"
          :to="openMenu(menuItem)"
          class="mr-6 nav-mobile-links nav-mobile-spacing "
        >
          {{ menuItem.node.label }}
        </nuxt-link>
      </div>
    </transition>
  </div>
</template>

<script>
import LinkResolver from '~/mixins/linkResolver'
import { mapGetters, mapState } from 'vuex'
import SearchWP from '~/components/SearchWP'
import Loader from '~/components/animations/Loader'
import '~/node_modules/hamburgers/dist/hamburgers.min.css'

export default {
  name: 'Header',
  components: {
    SearchWP,
    Loader
  },
  mixins: [LinkResolver],
  data() {
    return {
      hideHeaderInterval: null,
      showSearch: false,
      searchString: null,
      searchThrottle: null,
      isLoading: null,
      prevScrollpos: null,
      showMobileNav: false
    }
  },
  computed: {
    ...mapGetters(['headerMenu', 'siteConfig', 'headerIconsMenu']),
    ...mapGetters(['getBaseURL']),
    ...mapState(['routerStatus', 'config'])
  },
  watch: {
    routerStatus(status) {
      if (status === 'out') this.showMobileNav = false
    }
  },
  mounted() {
    // show hide header on scroll
    document.addEventListener('scroll', this.showHideHeader)
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.showHideHeader)
  },
  methods: {
    searchNewPage() {
      if (this.searchString)
        this.$router.push({
          path: `/search/${this.searchString}/`,
          id: this.searchString
        })
    },
    showHideHeader() {
      if (!this.prevScrollpos) this.prevScrollpos = window.pageYOffset
      clearTimeout(this.hideHeaderInterval)
      const currentScrollPos = window.pageYOffset
      const header = document.querySelector('.site-header')
      if (document.readyState === 'complete') {
        this.showMobileNav = false
        if (this.prevScrollpos > currentScrollPos) {
          this.hideHeaderInterval = setTimeout(() => {
            this.showSearch = false
            header.style =
              'transform:translate(0px, 0px);transition: all 0.3s ease-in;'
          }, 10)
        } else if (
          this.prevScrollpos < currentScrollPos &&
          currentScrollPos > 200
        ) {
          this.hideHeaderInterval = setTimeout(() => {
            header.style =
              'transform:translate(0px, -3.5em);transition: all 0.1s ease-out;'
          }, 10)
        }
        this.prevScrollpos = currentScrollPos
      }
    },
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
      console.log('goto ', slug, e)

      if (linkType === 'page') {
        this.$router.push({ path: `/page/${slug}/` })
      } else if (linkType === 'post') {
        this.$router.push({ path: `/post/${slug}/` })
      }
    },
    mobileLink(menuItem) {
      this.showMobileNav = false
      return this.openMenu(menuItem)
    },
    toggleSearch() {
      // this.showMobileNav = false
      this.showSearch = !this.showSearch
      if (this.showSearch) {
        setTimeout(() => {
          document.getElementById('headerSearchInput').focus()
        }, 500)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.site-header {
  height: 3.5em;
  willchange: transform;
}
.site-header img {
  @apply my-0 py-0;
}
.siteTitle {
  @apply font-bold font-mono text-base mr-5 p-0;
  text-decoration: none;
  color: #10dcd1;
}
.social-link {
  @apply font-mono uppercase font-normal text-xs border-l-2 block flex p-4;
  height: 4.5em;
  width: 4.5em;
}
.nav-links {
  @apply font-mono uppercase font-normal text-xs;
  color: #333333;
}
.active-link {
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-color: #10dcd1;
  text-decoration-thickness: 2px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fadeloader-enter-active,
.fadeloader-leave-active {
  transition: opacity 0.3s;
  transition-delay: 0.5s;
}
.fadeloader-enter, .fadeloader-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slidedown-enter-active,
.slidedown-leave-active {
  transition: all 0.3s ease-in-out;
  transform: translate(0px, 0px);
}
.slidedown-enter, .slidedown-leave-to /* .fade-leave-active below version 2.1.8 */ {
  /* opacity: 0; */
  transform: translate(0px, -100%);
}
/* mobile speficic */
.mobile-nav {
  @apply fixed z-10 w-full;
  margin-top: 3.5em;
}

.nav-mobile-spacing {
  @apply relative flex w-full bg-white py-5 pl-8 text-xl font-mono text-grey-darker border-b-4;
}
.nav-mobile-links {
  @apply font-mono uppercase text-grey-darker;
}
.nav-mobile-links:hover {
  @apply bg-highlight text-white;
}
</style>
