import type { Store } from 'vuex'
import { eventBus } from '~/lib/events'
import type { RootState } from '~/store'

const STORAGE_KEY = 'inventory.activity'

type Entries = RootState['events']

function read(): Entries {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Entries) : []
  } catch {
    return []
  }
}

function write(entries: Entries): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    return
  }
}

export default defineNuxtPlugin({
  name: 'domain-events',
  dependsOn: ['vuex'],
  setup(nuxtApp) {
    const store = nuxtApp.$store as Store<RootState>

    eventBus.on('*', (event) => store.commit('PUSH_EVENT', event))

    nuxtApp.hook('app:suspense:resolve', () => {
      const saved = read()
      if (saved.length) store.commit('SET_EVENTS', saved)

      store.subscribe((mutation, state) => {
        if (mutation.type !== 'PUSH_EVENT' && mutation.type !== 'SET_EVENTS') return
        write(state.events)
      })
    })
  },
})
