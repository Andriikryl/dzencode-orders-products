import { createStore, type Store } from 'vuex'
import type { InjectionKey } from 'vue'
import type { Order, Product } from '~/types'
import { eventBus, type DomainEvent } from '~/lib/events'

export interface RootState {
  orders: Order[]
  products: Product[]
  productTypes: string[]
  openOrderId: number | null
  typeFilter: string
  search: string
  activeSessions: number
  events: Array<{ id: number; event: DomainEvent; at: string }>
  loading: boolean
  error: string | null
}

export const storeKey: InjectionKey<Store<RootState>> = Symbol('store')

export function buildStore() {
  return createStore<RootState>({
    state: (): RootState => ({
      orders: [],
      products: [],
      productTypes: [],
      openOrderId: null,
      typeFilter: '',
      search: '',
      activeSessions: 0,
      events: [],
      loading: false,
      error: null,
    }),

    getters: {
      productsByOrder: (state): Record<number, Product[]> =>
        state.products.reduce<Record<number, Product[]>>((acc, product) => {
          ;(acc[product.order] ??= []).push(product)
          return acc
        }, {}),

      openOrderProducts: (_state, getters): Product[] => {
        const id = (_state as RootState).openOrderId
        if (id === null) return []
        return getters.productsByOrder[id] ?? []
      },

      filteredProducts: (state): Product[] => {
        const query = state.search.trim().toLowerCase()

        return state.products.filter((product) => {
          if (state.typeFilter && product.type !== state.typeFilter) return false
          if (!query) return true

          return (
            product.title.toLowerCase().includes(query) ||
            product.type.toLowerCase().includes(query) ||
            String(product.serialNumber).includes(query)
          )
        })
      },

      filteredOrders: (state): Order[] => {
        const query = state.search.trim().toLowerCase()
        if (!query) return state.orders
        return state.orders.filter((order) => order.title.toLowerCase().includes(query))
      },
    },

    mutations: {
      SET_ORDERS(state, orders: Order[]) {
        state.orders = orders
      },
      SET_PRODUCTS(state, products: Product[]) {
        state.products = products
      },
      SET_PRODUCT_TYPES(state, types: string[]) {
        state.productTypes = types
      },
      SET_OPEN_ORDER(state, id: number | null) {
        state.openOrderId = id
      },
      SET_TYPE_FILTER(state, type: string) {
        state.typeFilter = type
      },
      SET_SEARCH(state, value: string) {
        state.search = value
      },
      SET_ACTIVE_SESSIONS(state, count: number) {
        state.activeSessions = count
      },
      PUSH_EVENT(state, event: DomainEvent) {
        const nextId = state.events.reduce((max, entry) => Math.max(max, entry.id), 0) + 1
        state.events = [
          { id: nextId, event, at: new Date().toLocaleTimeString() },
          ...state.events,
        ].slice(0, 20)
      },
      SET_EVENTS(state, events: RootState['events']) {
        state.events = events.slice(0, 20)
      },
      REMOVE_ORDER(state, id: number) {
        state.orders = state.orders.filter((order) => order.id !== id)
        state.products = state.products.filter((product) => product.order !== id)
        if (state.openOrderId === id) state.openOrderId = null
      },
      REMOVE_PRODUCT(state, id: number) {
        state.products = state.products.filter((product) => product.id !== id)
      },
      SET_LOADING(state, value: boolean) {
        state.loading = value
      },
      SET_ERROR(state, message: string | null) {
        state.error = message
      },
    },

    actions: {
      async init({ commit, state }, fetcher: typeof $fetch = $fetch) {
        if (state.orders.length && state.products.length) return

        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        try {
          const [orders, products, types] = await Promise.all([
            fetcher<Order[]>('/api/orders'),
            fetcher<Product[]>('/api/products'),
            fetcher<string[]>('/api/product-types'),
          ])
          commit('SET_ORDERS', orders)
          commit('SET_PRODUCTS', products)
          commit('SET_PRODUCT_TYPES', types)
        } catch (error) {
          commit(
            'SET_ERROR',
            error instanceof Error ? error.message : 'Не удалось загрузить данные',
          )
        } finally {
          commit('SET_LOADING', false)
        }
      },

      toggleOrder({ commit, state }, id: number) {
        const opening = state.openOrderId !== id
        commit('SET_OPEN_ORDER', opening ? id : null)

        const order = state.orders.find((item) => item.id === id)
        if (opening && order) {
          eventBus.emit({ type: 'order:opened', orderId: id, title: order.title })
        }
      },

      closeOrder({ commit }) {
        commit('SET_OPEN_ORDER', null)
      },

      setTypeFilter({ commit }, value: string) {
        commit('SET_TYPE_FILTER', value)
        eventBus.emit({ type: 'filter:changed', value })
      },

      deleteOrder({ commit, getters }, order: Order) {
        const productCount = (getters.productsByOrder[order.id] ?? []).length
        commit('REMOVE_ORDER', order.id)
        eventBus.emit({
          type: 'order:deleted',
          orderId: order.id,
          title: order.title,
          productCount,
        })
      },

      deleteProduct({ commit }, product: Product) {
        commit('REMOVE_PRODUCT', product.id)
        eventBus.emit({
          type: 'product:deleted',
          productId: product.id,
          title: product.title,
          orderId: product.order,
        })
      },
    },
  })
}
