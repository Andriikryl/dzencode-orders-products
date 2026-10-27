import { useStore } from 'vuex'
import type { Store } from 'vuex'
import { storeKey, type RootState } from '~/store'

export function useAppStore(): Store<RootState> {
  return useStore(storeKey)
}
