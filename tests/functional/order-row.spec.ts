// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import OrderRow from '../../app/components/OrderRow.vue'
import type { Order, Product } from '../../app/types'

const order: Order = {
  id: 1,
  title: 'Приход 1',
  date: '2017-06-29 12:09:33',
  description: 'desc',
}

function makeProduct(id: number, usd: number, uah: number): Product {
  return {
    id,
    serialNumber: 1000 + id,
    isNew: 1,
    photo: '',
    title: `Product ${id}`,
    type: 'Monitors',
    specification: 'Spec',
    guarantee: { start: '2017-06-29 12:09:33', end: '2018-06-29 12:09:33' },
    price: [
      { value: usd, symbol: 'USD', isDefault: 0 },
      { value: uah, symbol: 'UAH', isDefault: 1 },
    ],
    order: 1,
    date: '2017-06-29 12:09:33',
    status: 'free',
  }
}

const products = [makeProduct(1, 100, 2600), makeProduct(2, 50, 1300)]

describe('OrderRow', () => {
  it('shows the order title and how many products it holds', async () => {
    const row = await mountSuspended(OrderRow, { props: { order, products } })

    expect(row.text()).toContain('Приход 1')
    expect(row.find('.order-row__count-value').text()).toBe('2')
  })

  it('shows the creation date in both required formats', async () => {
    const row = await mountSuspended(OrderRow, { props: { order, products } })
    const text = row.find('.order-row__date').text()

    expect(text).toContain('29 / 06')
    expect(text).toMatch(/29 \/ \w+ \/ 2017/)
  })

  it('sums the product prices in both currencies', async () => {
    const row = await mountSuspended(OrderRow, { props: { order, products } })
    const text = row.text().replace(/\s/g, ' ')

    expect(text).toContain('150.00')
    expect(text).toContain('3,900.00')
  })

  it('hides the title when asked to render compact', async () => {
    const row = await mountSuspended(OrderRow, {
      props: { order, products, compact: true },
    })

    expect(row.find('.order-row__title').exists()).toBe(false)
  })

  it('reports a click on the row and a click on delete separately', async () => {
    const row = await mountSuspended(OrderRow, { props: { order, products } })

    await row.find('.order-row__delete').trigger('click')
    await row.trigger('click')

    expect(row.emitted('remove')).toHaveLength(1)
    expect(row.emitted('select')).toBeTruthy()
  })
})
