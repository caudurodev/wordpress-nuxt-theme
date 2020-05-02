import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['getBaseURL'])
  },
  mounted() {
    window.document.addEventListener('click', this.resolveInternalLinks)
  },
  beforeDestroy() {
    window.document.removeEventListener('click', this.resolveInternalLinks)
  },
  methods: {
    goToLink(e) {
      console.log('goToLink', e)
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
    openMenu(item) {
      if (!item) return
      const linkType = item.node.connectedObject.__typename

      if (linkType === 'Page') {
        return `/page/${item.node.connectedObject.slug}/`
      } else if (linkType === 'Post') {
        return `/post/${item.node.connectedObject.slug}/`
      } else if (linkType === 'MenuItem') {
        if (item.node.url.includes(this.getBaseURL)) {
          // URL
          return item.node.url
        } else {
          // hash
          return item.node.url.replace('http://', '').replace('https://', '')
        }
      } else {
        return
      }
    }
  }
}
