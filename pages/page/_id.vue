<template>
  <section class="container">
    <div class="w-2/4 mx-auto">
      <h1 v-html="pageBy.title" />
      <span class="" v-html="pageBy.content" />
    </div>
  </section>
</template>

<script>
import gqlConfig from '~/pages/gql/config.graphql'
import gqlRequest from '~/pages/page/gql/page.graphql'
import LinkResolver from '~/mixins/linkResolver'

export default {
  name: 'SinglePage',
  mixins: [LinkResolver],
  asyncData({ store, params, redirect }) {
    return store
      .dispatch('loadPage', {
        gqlFiles: [gqlConfig, gqlRequest.replace('[xxxx]', params.id)],
        redirect: redirect
      })
      .then(returnData => {
        return returnData
      })
  }
}
</script>

<style></style>
