<template>
  <section class="container">
    <div>
      <div class="flex flex-wrap mb-4 w-full md:w-3/4 mx-auto">
        <template v-for="(post, index) in posts.edges">
          <FullWidth
            v-if="index === maxColumns()"
            :key="post.node.id"
            :post="post.node"
            class="md:w-full w-full mx-auto sm:mt-0 pt-20 flex flex-wrap"
          ></FullWidth>
          <Card
            v-if="index !== maxColumns()"
            :key="post.node.id"
            :post="post.node"
            class="sm:w-full md:w-1/2 lg:w-1/3 flex flex-wrap"
          ></Card>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import gqlConfig from '~/pages/gql/config.graphql'
import gqlHome from '~/pages/gql/home.graphql'
import FullWidth from '~/components/previews/FullWidth'
import Card from '~/components/previews/Card'

export default {
  components: { FullWidth, Card },
  asyncData({ store, redirect }) {
    return store
      .dispatch('loadPage', {
        gqlFiles: [gqlConfig, gqlHome],
        redirect: redirect
      })
      .then(returnData => {
        return returnData
      })
  },
  methods: {
    maxColumns() {
      if (this.$mq === 'xl') return 3
      if (this.$mq === 'lg') return 2
      if (this.$mq === 'sm' || this.$mq === 'md') return 1
      return 2
    }
  }
}
</script>

<style lang="postcss">
/* .card {
  @apply m-2 bg-white px-6 py-5 border rounded-sm;
} */
/* .card-wide {
  @apply w-3/4 mx-auto flex flex-wrap bg-white py-5 border-t-2 border-b-2 mb-20 border-grey-light;
  min-height: 20em;
} */
/* .thumb {
  @apply h-64;
  object-fit: cover;
} */
/* .side-thumb {
  @apply h-full my-0 py-0 w-full;
  object-fit: cover;
} */
/* .avatar {
  @apply h-12 w-12;
  object-fit: cover;
} */
</style>
