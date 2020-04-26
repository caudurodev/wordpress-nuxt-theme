<template>
  <section class="flex flex-wrap w-full">
    <div class="body-other">
      <h1 v-html="postBy.title" />
      <div class="flex flex-wrap">
        <div>
          <img
            v-if="postBy.author.avatar"
            :src="postBy.author.avatar.url"
            class="avatar"
          />
        </div>

        <div>
          <h3 class="font-mono text-grey-dark mt-5 pt-0 mx-4 mb-0 pb-0">
            {{ postBy.author.name }}
          </h3>
          <h4 class="font-mono text-grey ml-4 pt-0 mt-1">
            {{ $moment(postBy.date).fromNow() }}
          </h4>
        </div>
      </div>
    </div>
    <img
      v-if="postBy.featuredImage"
      :src="postBy.featuredImage.sourceUrl"
      class="featured-image"
    />
    <div class="body-main" v-html="postBy.content"></div>
    <div class="body-other mt-8 pt-8">
      <div class="flex border-t-2 border-b-2 py-8 px-4">
        <div class="mx-auto">
          <img
            v-if="postBy.author.avatar"
            :src="postBy.author.avatar.url"
            class="avatar-big"
          />
        </div>

        <div class="flex-1 mx-auto ml-6">
          <h3 class="font-mono text-grey-dark mt-5 pt-0 mx-4 mb-0 pb-0">
            {{ postBy.author.name }}
          </h3>
          <p class="font-mono text-grey ml-4 pt-0 mt-1">
            {{ postBy.author.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import gqlConfig from '~/pages/gql/config.graphql'
import gqlRequest from '~/pages/post/gql/post.graphql'

import Prism from 'prismjs'
import PrismLineNumbers from 'prismjs/plugins/line-numbers/prism-line-numbers'
import '~/node_modules/prismjs/themes/prism-okaidia.css'
import '~/node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css'

// import lax from 'lax.js'

import { mapGetters } from 'vuex'

export default {
  name: 'SinglePost',
  asyncData({ store, params, redirect }) {
    return store
      .dispatch('loadPage', {
        gqlFiles: [gqlConfig, gqlRequest.replace('[xxxx]', params.id)],
        redirect: redirect,
      })
      .then((returnData) => {
        return returnData
      })
  },
  computed: {
    ...mapGetters(['moment']),
  },
  mounted() {
    PrismLineNumbers
    Prism.highlightAll()
    document.querySelectorAll('img').forEach((img) => {
      img.removeAttribute('width')
      img.removeAttribute('height')
    })
    document.querySelectorAll('figure').forEach((fig) => {
      fig.removeAttribute('style')
    })

    //   document.querySelectorAll('figure').forEach(fig => {
    //     fig.setAttribute('data-lax-preset', 'blurInOut')
    //   })

    //   this.$nextTick(() => {
    //     // setup lax
    //     lax.setup()
    //     document.addEventListener(
    //       'scroll',
    //       () => {
    //         lax.update(window.scrollY)
    //       },
    //       false
    //     )
    //     document.querySelectorAll('figure').forEach(fig => {
    //       lax.addElement(fig)
    //     })
    //   })
    // },
    // beforeDestroy() {
    //   document.querySelectorAll('figure').forEach(fig => {
    //     lax.removeElement(fig)
    //   })
    //   window.removeEventListener('scroll', () => {})
  },
}
</script>

<style lang="postcss">
.body-main {
  @apply w-full mx-auto;
}
.body-other {
  @apply w-full mx-auto;
}

.featured-image {
  @apply w-full mb-10;
  object-fit: cover;
}

.body-main figure {
  @apply w-full font-mono text-grey-dark text-sm mb-10;
  object-fit: cover;
}

.body-main p,
.body-main code,
.body-main pre,
.body-main h1,
.body-main figcaption,
.body-main ol,
.body-main ul,
.body-main h2,
.body-main h3,
.body-main h4,
.body-main h5,
.body-main h6 {
  @apply w-full;
}

/* override class added on mounted hook */
.body-main pre[class*='language-'] {
  margin: auto !important;
}

.body-main p,
.body-main code,
.body-main pre {
  @apply my-6;
}
@screen sm {
  .body-main p,
  .body-main code,
  .body-main pre,
  .body-main h1,
  .body-main figcaption,
  .body-main ol,
  .body-main ul,
  .body-main h2,
  .body-main h3,
  .body-main h4,
  .body-main h5,
  .body-main h6 {
    @apply w-2/3 mx-auto;
  }
  .body-other {
    @apply w-2/3 mx-auto;
  }
}
.avatar {
  @apply h-12 w-12 rounded-full;
  object-fit: cover;
}
.avatar-big {
  @apply h-24 w-24 rounded-full;
  object-fit: cover;
}
@screen sm {
  .avatar-big {
    @apply h-16 w-16;
  }
}
</style>
