import type { Store } from 'vuex'
import type { RootState } from '~/store'

const STORAGE_KEY = 'inventory.ui'

interface PersistedUi {
  typeFilter: string
  openOrderId: number | null
}

function read(): PersistedUi | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PersistedUi) : null
  } catch {
    return null
  }
}

function write(value: PersistedUi): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    return
  }
}

export default defineNuxtPlugin({
  name: 'persist-ui',
  dependsOn: ['vuex'],
  setup(nuxtApp) {
    const store = nuxtApp.$store as Store<RootState>

    nuxtApp.hook('app:suspense:resolve', () => {
      const saved = read()
      if (!saved) return

      if (saved.typeFilter) store.commit('SET_TYPE_FILTER', saved.typeFilter)
      if (saved.openOrderId !== null) store.commit('SET_OPEN_ORDER', saved.openOrderId)
    })

    store.subscribe((mutation, state) => {
      if (mutation.type !== 'SET_TYPE_FILTER' && mutation.type !== 'SET_OPEN_ORDER') return
      write({ typeFilter: state.typeFilter, openOrderId: state.openOrderId })
    })
  },
})
