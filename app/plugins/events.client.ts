import type { Store } from 'vuex'
import { eventBus } from '~/lib/events'
import type { RootState } from '~/store'

export default defineNuxtPlugin({
  name: 'domain-events',
  dependsOn: ['vuex'],
  setup(nuxtApp) {
    const store = nuxtApp.$store as Store<RootState>
    eventBus.on('*', (event) => store.commit('PUSH_EVENT', event))
  },
})
