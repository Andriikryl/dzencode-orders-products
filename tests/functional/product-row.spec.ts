// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProductRow from '../../app/components/ProductRow.vue'
import type { Product } from '../../app/types'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    serialNumber: 123456789,
    isNew: 1,
    photo: '',
    title: 'Gigabyte Technology X58-USB3',
    type: 'Monitors',
    specification: 'Spec',
    guarantee: { start: '2017-06-29 12:09:33', end: '2025-08-06 12:09:33' },
    price: [
      { value: 2500, symbol: 'USD', isDefault: 0 },
      { value: 250000.5, symbol: 'UAH', isDefault: 1 },
    ],
    order: 7,
    date: '2017-09-06 12:09:33',
    status: 'free',
    ...overrides,
  }
}

describe('ProductRow', () => {
  it('shows the product title, serial number and type', async () => {
    const row = await mountSuspended(ProductRow, {
      props: { product: makeProduct(), orderTitle: 'Приход 7' },
    })

    expect(row.find('.product-row__title').text()).toBe('Gigabyte Technology X58-USB3')
    expect(row.find('.product-row__sn').text()).toBe('SN-123456789')
    expect(row.find('.product-row__type').text()).toBe('Monitors')
  })

  it('shows the title of the order it belongs to', async () => {
    const row = await mountSuspended(ProductRow, {
      props: { product: makeProduct(), orderTitle: 'Приход 7' },
    })

    expect(row.find('.product-row__order').text()).toBe('Приход 7')
  })

  it('falls back to a dash when the order title is unknown', async () => {
    const row = await mountSuspended(ProductRow, { props: { product: makeProduct() } })

    expect(row.find('.product-row__order').text()).toBe('—')
  })

  it('shows both guarantee dates', async () => {
    const row = await mountSuspended(ProductRow, { props: { product: makeProduct() } })
    const text = row.find('.product-row__guarantee').text()

    expect(text).toMatch(/29 \/ \w+ \/ 2017/)
    expect(text).toMatch(/06 \/ \w+ \/ 2025/)
  })

  it('shows the price in both currencies', async () => {
    const row = await mountSuspended(ProductRow, { props: { product: makeProduct() } })
    const text = row.find('.product-row__price').text().replace(/\s/g, ' ')

    expect(text).toContain('2,500.00')
    expect(text).toContain('250,000.50')
  })

  it('shows a dash for a currency the product has no price in', async () => {
    const product = makeProduct({ price: [{ value: 2500, symbol: 'USD', isDefault: 1 }] })
    const row = await mountSuspended(ProductRow, { props: { product } })

    expect(row.find('.product-row__price').text()).toContain('—')
  })

  it('shows the creation date in both required formats', async () => {
    const row = await mountSuspended(ProductRow, { props: { product: makeProduct() } })
    const text = row.find('.product-row__date').text()

    expect(text).toContain('06 / 09')
    expect(text).toMatch(/06 \/ \w+ \/ 2017/)
  })

  it('marks a product that is in repair', async () => {
    const row = await mountSuspended(ProductRow, {
      props: { product: makeProduct({ status: 'in-repair' }) },
    })

    expect(row.find('.product-row__status--busy').exists()).toBe(true)
  })

  it('reports a delete request', async () => {
    const row = await mountSuspended(ProductRow, { props: { product: makeProduct() } })

    await row.find('.product-row__delete').trigger('click')

    expect(row.emitted('remove')).toHaveLength(1)
  })
})
