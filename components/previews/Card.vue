<template>
  <div class="px-3 pt-3 pb-6 w-full">
    <div class="card">
      <div class="w-full bg-grey-lighter thumb">
        <img
          v-if="post.featuredImage"
          :src="post.featuredImage.sourceUrl"
          class="thumb"
        />
        <div v-else class="thumb"></div>
      </div>

      <div class="px-4 mt-0 pt-0 pb-2 ">
        <div class="pb-20">
          <h2 class="mb-4 pb-0">
            <nuxt-link :to="`/post/${post.slug}`" v-html="post.title" />
          </h2>
          <p class="mb-4" v-html="post.excerpt" />
        </div>

        <div class="bottom-stick">
          <div class=" flex flex-wrap">
            <div class="">
              <img
                v-if="post.author.avatar"
                :src="post.author.avatar.url"
                class="avatar"
              />
            </div>

            <div>
              <h3 class="font-mono text-grey-dark mt-5 pt-0 mx-4 mb-0 pb-0">
                {{ post.author.name }}
              </h3>
              <h4 class="font-mono text-grey ml-4 pt-0 mt-1">
                {{ $moment(post.date).fromNow() }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="postcss" scoped>
.card {
  @apply relative w-full bg-white p-0 m-0 border rounded-sm;
}

.height-box {
  /* min-height: 28em; */
}
.thumb-box {
  /* height: 12em; */
}
.thumb {
  @apply m-0 p-0 h-full;
  object-fit: cover;
  height: 12em;
}

.bottom-stick {
  /* margin-bottom: auto; */
  bottom: 0;
  position: absolute;
  z-index: 1;

  /* margin-left: auto; */
  /* margin-bottom: auto; */
}
</style>
