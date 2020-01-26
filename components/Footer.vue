<template>
  <div class="mt-12 pt-8 pb-16 bg-grey-light ">
    <span class="flex justify-center mx-4" v-html="footer"></span>
    <div class="flex justify-center mt-4">
      <nuxt-link
        v-for="menuItem in footerMenu"
        :key="menuItem.node.id"
        :to="openMenu(menuItem)"
        class="mr-6 nav-links link-style"
      >
        {{ menuItem.node.label }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import LinkResolver from '~/mixins/linkResolver'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Footer',
  mixins: [LinkResolver],
  computed: {
    ...mapGetters(['footerMenu']),
    ...mapState(['footer'])
  }
}
</script>

<style lang="postcss"></style>
