import { io, type Socket } from 'socket.io-client'
import { useAppStore } from '~/composables/useAppStore'

export function useSessionCounter() {
  const store = useAppStore()
  const config = useRuntimeConfig()
  let socket: Socket | undefined

  onMounted(() => {
    socket = io(config.public.socketUrl)
    socket.on('sessions', (count: number) => {
      store.commit('SET_ACTIVE_SESSIONS', count)
    })
  })

  onBeforeUnmount(() => {
    socket?.disconnect()
    socket = undefined
  })

  return {
    activeSessions: computed(() => store.state.activeSessions),
  }
}
