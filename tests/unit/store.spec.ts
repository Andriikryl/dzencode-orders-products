import { beforeEach, describe, expect, it } from 'vitest'
import { buildStore } from '../../app/store'
import type { Order, Product } from '../../app/types'

function makeProduct(id: number, order: number, type = 'Monitors'): Product {
  return {
    id,
    serialNumber: 1000 + id,
    isNew: 1,
    photo: '',
    title: `Product ${id}`,
    type,
    specification: `Spec ${id}`,
    guarantee: { start: '2017-06-29 12:09:33', end: '2018-06-29 12:09:33' },
    price: [
      { value: 100, symbol: 'USD', isDefault: 0 },
      { value: 2600, symbol: 'UAH', isDefault: 1 },
    ],
    order,
    date: '2017-06-29 12:09:33',
    status: 'free',
  }
}

const orders: Order[] = [
  { id: 1, title: 'Order 1', date: '2017-06-29 12:09:33', description: 'desc' },
  { id: 2, title: 'Order 2', date: '2017-07-29 12:09:33', description: 'desc' },
]

const products: Product[] = [
  makeProduct(1, 1, 'Monitors'),
  makeProduct(2, 1, 'Laptops'),
  makeProduct(3, 2, 'Monitors'),
]

let store: ReturnType<typeof buildStore>

beforeEach(() => {
  store = buildStore()
  store.commit('SET_ORDERS', orders)
  store.commit('SET_PRODUCTS', products)
  store.commit('SET_PRODUCT_TYPES', ['Laptops', 'Monitors'])
})

describe('productsByOrder', () => {
  it('groups products under the order they belong to', () => {
    const grouped = store.getters.productsByOrder
    expect(grouped[1]).toHaveLength(2)
    expect(grouped[2]).toHaveLength(1)
  })
})

describe('filteredProducts', () => {
  it('returns everything when no filter is set', () => {
    expect(store.getters.filteredProducts).toHaveLength(3)
  })

  it('narrows to the selected type', () => {
    store.commit('SET_TYPE_FILTER', 'Monitors')
    expect(store.getters.filteredProducts).toHaveLength(2)
  })

  it('returns an empty list for a type nothing matches', () => {
    store.commit('SET_TYPE_FILTER', 'Phones')
    expect(store.getters.filteredProducts).toHaveLength(0)
  })
})

describe('toggleOrder', () => {
  it('opens an order that was closed', () => {
    store.dispatch('toggleOrder', 1)
    expect(store.state.openOrderId).toBe(1)
  })

  it('closes the order when the same one is picked again', () => {
    store.dispatch('toggleOrder', 1)
    store.dispatch('toggleOrder', 1)
    expect(store.state.openOrderId).toBeNull()
  })

  it('switches straight to another order', () => {
    store.dispatch('toggleOrder', 1)
    store.dispatch('toggleOrder', 2)
    expect(store.state.openOrderId).toBe(2)
  })
})

describe('openOrderProducts', () => {
  it('is empty while no order is open', () => {
    expect(store.getters.openOrderProducts).toHaveLength(0)
  })

  it('returns the products of the open order', () => {
    store.dispatch('toggleOrder', 2)
    expect(store.getters.openOrderProducts).toHaveLength(1)
  })
})

describe('REMOVE_ORDER', () => {
  it('drops the order', () => {
    store.commit('REMOVE_ORDER', 1)
    expect(store.state.orders.map((order) => order.id)).toEqual([2])
  })

  it('drops the products that belonged to it', () => {
    store.commit('REMOVE_ORDER', 1)
    expect(store.state.products.map((product) => product.id)).toEqual([3])
  })

  it('closes the detail panel when the open order is removed', () => {
    store.dispatch('toggleOrder', 1)
    store.commit('REMOVE_ORDER', 1)
    expect(store.state.openOrderId).toBeNull()
  })

  it('leaves the panel alone when another order is removed', () => {
    store.dispatch('toggleOrder', 1)
    store.commit('REMOVE_ORDER', 2)
    expect(store.state.openOrderId).toBe(1)
  })
})

describe('REMOVE_PRODUCT', () => {
  it('drops only the product asked for', () => {
    store.commit('REMOVE_PRODUCT', 2)
    expect(store.state.products.map((product) => product.id)).toEqual([1, 3])
  })

  it('leaves the order in place', () => {
    store.commit('REMOVE_PRODUCT', 1)
    expect(store.state.orders).toHaveLength(2)
  })
})

describe('SET_ACTIVE_SESSIONS', () => {
  it('stores the number pushed over the socket', () => {
    store.commit('SET_ACTIVE_SESSIONS', 4)
    expect(store.state.activeSessions).toBe(4)
  })
})
