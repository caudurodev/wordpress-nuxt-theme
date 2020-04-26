export default function ({ store }) {
  if (!process.server) {
    store.dispatch('updateRouterTransitionStatus', 'out')
    store.app.router.afterEach(() => {
      store.dispatch('updateRouterTransitionStatus', 'in')
    })
  }
}
