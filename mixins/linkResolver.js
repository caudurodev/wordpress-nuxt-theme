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
    resolveInternalLinks(event) {
      event
      // const URL = event.target.href
      // if (URL && URL.includes(this.getBaseURL)) {
      //   let withoutBase = ''
      //   if (URL.includes('https')) {
      //     withoutBase = event.target.href.split('https://')[1].split('/')
      //     console.log('https internal link', withoutBase)
      //   } else if (URL.includes('http')) {
      //     withoutBase = event.target.href.split('/')
      //     console.log('http internal link', withoutBase[withoutBase.length - 2])
      //   }
      //   console.log('internal link', withoutBase)
      //   // window.location.href = `${this.getBaseURL}/`
      //   event.preventDefault()
      // }
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
    openMenu(item) {
      if (!item) return
      const linkType = item.node.connectedObject.__typename

      if (linkType === 'Page') {
        // this.$router.push({ path: `/page/${item.node.connectedObject.slug}/` })
        return `/page/${item.node.connectedObject.slug}/`
      } else if (linkType === 'Post') {
        // this.$router.push({ path: `/post/${item.node.connectedObject.slug}/` })
        return `/post/${item.node.connectedObject.slug}/`
      } else if (linkType === 'MenuItem') {
        if (item.node.url.includes(this.getBaseURL)) {
          // URL
          return item.node.url
          // window.location.href = item.node.url
        } else {
          // hash
          return item.node.url.replace('http://', '').replace('https://', '')
          // window.location.href = item.node.url
          //   .replace('http://', '')
          //   .replace('https://', '')
        }
      } else {
        return
        // console.log('open link', item.node.url)
      }
    }
  }
}
