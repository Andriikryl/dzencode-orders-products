import { buildStore, storeKey } from '~/store'

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = buildStore()
  nuxtApp.vueApp.use(store, storeKey)

  if (import.meta.server) {
    await store.dispatch('init')
    nuxtApp.payload.vuex = store.state
  } else if (nuxtApp.payload.vuex) {
    store.replaceState(nuxtApp.payload.vuex as typeof store.state)
  } else {
    await store.dispatch('init')
  }

  return { provide: { store } }
})
