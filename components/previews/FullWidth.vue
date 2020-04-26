<template>
  <div
    class="w-full card-wide mb-10 sm:border-t-2 sm:border-b-2 sm:border-grey-light"
  >
    <div
      class="lg:w-1/2 w-full bg-grey-lighter p-3 sm:pl-20 sm:pt-10 mt-0 sm:pr-20"
    >
      <h2 class="mb-4 pb-0">
        <nuxt-link :to="`/post/${post.slug}`" v-html="post.title" />
      </h2>
      <p class="" v-html="post.excerpt" />
      <div class="sm:mb-20 mb-3">
        <div>
          <h3 class="font-mono text-grey-dark mb-0 pb-0">
            {{ post.author.name }}
          </h3>
          <h4 class="font-mono text-grey py-0 my-0">
            {{ $moment(post.date).fromNow() }}
          </h4>
        </div>
      </div>
    </div>
    <div class="lg:w-1/2 w-full my-0 py-0 bg-grey-lighter">
      <nuxt-link :to="`/post/${post.slug}`">
        <img
          v-if="post.featuredImage"
          :src="post.featuredImage.sourceUrl"
          class="side-thumb"
        />
      </nuxt-link>
      <!-- <div
        v-if="!post.featuredImage"
        class="   bg-grey-light "
        style="height:400px;"
      ></div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'FullWidth',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="postcss" scoped>
.card-wide {
  @apply flex flex-wrap bg-white py-5;
  min-height: 20em;
}
@screen sm {
  .card-wide {
    min-height: 5em;
  }
}

.side-thumb {
  @apply h-full my-0 py-0 w-full;
  object-fit: cover;
}
</style>
