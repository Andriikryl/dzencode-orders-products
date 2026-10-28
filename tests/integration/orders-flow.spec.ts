import { beforeEach, describe, expect, it } from 'vitest'
import { buildStore } from '../../app/store'
import { eventBus, type DomainEvent } from '../../app/lib/events'
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
let seen: DomainEvent[]

beforeEach(() => {
  eventBus.clear()
  seen = []

  store = buildStore()
  store.commit('SET_ORDERS', orders)
  store.commit('SET_PRODUCTS', products)
  store.commit('SET_PRODUCT_TYPES', ['Laptops', 'Monitors'])

  eventBus.on('*', (event) => {
    seen.push(event)
    store.commit('PUSH_EVENT', event)
  })
})

describe('deleting an order', () => {
  it('drops the order together with its products', async () => {
    await store.dispatch('deleteOrder', orders[0])

    expect(store.state.orders.map((order) => order.id)).toEqual([2])
    expect(store.state.products.map((product) => product.id)).toEqual([3])
  })

  it('announces the deletion with the number of products it carried', async () => {
    await store.dispatch('deleteOrder', orders[0])

    expect(seen).toEqual([{ type: 'order:deleted', orderId: 1, title: 'Order 1', productCount: 2 }])
  })

  it('records the deletion in the activity feed', async () => {
    await store.dispatch('deleteOrder', orders[0])

    expect(store.state.events).toHaveLength(1)
    expect(store.state.events[0]!.event.type).toBe('order:deleted')
  })

  it('closes the detail panel when the open order is the one removed', async () => {
    await store.dispatch('toggleOrder', 1)
    expect(store.state.openOrderId).toBe(1)

    await store.dispatch('deleteOrder', orders[0])

    expect(store.state.openOrderId).toBeNull()
  })
})

describe('deleting a product', () => {
  it('drops only that product and leaves its order alone', async () => {
    await store.dispatch('deleteProduct', products[0])

    expect(store.state.products.map((product) => product.id)).toEqual([2, 3])
    expect(store.state.orders).toHaveLength(2)
  })

  it('announces the deletion with the order it belonged to', async () => {
    await store.dispatch('deleteProduct', products[0])

    expect(seen).toEqual([
      { type: 'product:deleted', productId: 1, title: 'Product 1', orderId: 1 },
    ])
  })
})

describe('opening an order', () => {
  it('announces the order that was opened', async () => {
    await store.dispatch('toggleOrder', 2)

    expect(seen).toEqual([{ type: 'order:opened', orderId: 2, title: 'Order 2' }])
  })

  it('stays silent when the same order is closed again', async () => {
    await store.dispatch('toggleOrder', 2)
    seen.length = 0

    await store.dispatch('toggleOrder', 2)

    expect(store.state.openOrderId).toBeNull()
    expect(seen).toEqual([])
  })
})

describe('filtering products', () => {
  it('narrows the list and announces the chosen type', async () => {
    await store.dispatch('setTypeFilter', 'Laptops')

    expect(store.getters.filteredProducts.map((product: Product) => product.id)).toEqual([2])
    expect(seen).toEqual([{ type: 'filter:changed', value: 'Laptops' }])
  })
})

describe('the activity feed', () => {
  it('keeps the newest entry first and gives every entry its own id', async () => {
    await store.dispatch('toggleOrder', 1)
    await store.dispatch('setTypeFilter', 'Laptops')

    const types = store.state.events.map((entry) => entry.event.type)
    const ids = store.state.events.map((entry) => entry.id)

    expect(types).toEqual(['filter:changed', 'order:opened'])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps at most twenty entries', async () => {
    for (let i = 0; i < 25; i += 1) {
      await store.dispatch('setTypeFilter', i % 2 ? 'Laptops' : 'Monitors')
    }

    expect(store.state.events).toHaveLength(20)
    expect(new Set(store.state.events.map((entry) => entry.id)).size).toBe(20)
  })
})
