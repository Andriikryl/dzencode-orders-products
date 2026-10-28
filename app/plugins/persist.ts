import type { Store } from 'vuex'
import type { RootState } from '~/store'

const COOKIE_KEY = 'inventory.ui'

interface PersistedUi {
  typeFilter: string
  openOrderId: number | null
}

export default defineNuxtPlugin({
  name: 'persist-ui',
  dependsOn: ['vuex'],
  setup(nuxtApp) {
    const store = nuxtApp.$store as Store<RootState>

    const cookie = useCookie<PersistedUi | null>(COOKIE_KEY, {
      default: () => null,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })

    const saved = cookie.value
    if (saved) {
      if (saved.typeFilter) store.commit('SET_TYPE_FILTER', saved.typeFilter)
      if (saved.openOrderId !== null) store.commit('SET_OPEN_ORDER', saved.openOrderId)
    }

    if (import.meta.client) {
      store.subscribe((mutation, state) => {
        if (mutation.type !== 'SET_TYPE_FILTER' && mutation.type !== 'SET_OPEN_ORDER') return
        cookie.value = { typeFilter: state.typeFilter, openOrderId: state.openOrderId }
      })
    }
  },
})
