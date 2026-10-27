import { createStore, type Store } from 'vuex'
import type { InjectionKey } from 'vue'
import type { Order, Product } from '~/types'

export interface RootState {
  orders: Order[]
  products: Product[]
  productTypes: string[]
  openOrderId: number | null
  typeFilter: string
  activeSessions: number
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
      activeSessions: 0,
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

      filteredProducts: (state): Product[] =>
        state.typeFilter
          ? state.products.filter((product) => product.type === state.typeFilter)
          : state.products,
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
      SET_ACTIVE_SESSIONS(state, count: number) {
        state.activeSessions = count
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
      async init({ commit, state }) {
        if (state.orders.length && state.products.length) return

        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        try {
          const [orders, products, types] = await Promise.all([
            $fetch<Order[]>('/api/orders'),
            $fetch<Product[]>('/api/products'),
            $fetch<string[]>('/api/product-types'),
          ])
          commit('SET_ORDERS', orders)
          commit('SET_PRODUCTS', products)
          commit('SET_PRODUCT_TYPES', types)
        } catch (error) {
          commit('SET_ERROR', error instanceof Error ? error.message : 'Не удалось загрузить данные')
        } finally {
          commit('SET_LOADING', false)
        }
      },

      toggleOrder({ commit, state }, id: number) {
        commit('SET_OPEN_ORDER', state.openOrderId === id ? null : id)
      },
    },
  })
}
