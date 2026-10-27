import type { Order, Product, ProductStatus } from '~~/app/types'

const PRODUCT_TYPES = ['Monitors', 'Laptops', 'Phones', 'Printers', 'Tablets'] as const

const TITLES: Record<(typeof PRODUCT_TYPES)[number], string[]> = {
  Monitors: ['Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3', 'Dell UltraSharp U2720Q'],
  Laptops: ['Lenovo ThinkPad X1 Carbon Gen 11', 'ASUS ZenBook 14 OLED'],
  Phones: ['Samsung Galaxy S24 Ultra', 'Google Pixel 8 Pro'],
  Printers: ['HP LaserJet Pro M404dn', 'Canon imageCLASS MF445dw'],
  Tablets: ['Apple iPad Air 11 M2', 'Samsung Galaxy Tab S9'],
}

const ORDER_COUNT = 25

function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function stamp(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)} 12:09:33`
}

export const orders: Order[] = Array.from({ length: ORDER_COUNT }, (_, i) => {
  const id = i + 1
  const month = (i % 12) + 1
  const day = ((i * 3) % 27) + 1
  return {
    id,
    title:
      id % 3 === 0
        ? `Длинное предлинное длиннючее название прихода ${id}`
        : `Приход ${id}`,
    date: stamp(2017, month, day),
    description: `Описание прихода ${id}`,
  }
})

export const products: Product[] = orders.flatMap((order, orderIndex) => {
  const perOrder = 3 + Math.floor(seeded(order.id) * 5)

  return Array.from({ length: perOrder }, (_, i) => {
    const globalIndex = orderIndex * 10 + i
    const type = PRODUCT_TYPES[globalIndex % PRODUCT_TYPES.length]!
    const titles = TITLES[type]
    const usd = 50 + Math.round(seeded(globalIndex + 1) * 2450)
    const status: ProductStatus = seeded(globalIndex + 7) > 0.25 ? 'free' : 'in-repair'

    return {
      id: globalIndex + 1,
      serialNumber: 12_3456_789 + globalIndex,
      isNew: seeded(globalIndex + 3) > 0.5 ? 1 : 0,
      photo: `/images/products/${type.toLowerCase()}.svg`,
      title: titles[i % titles.length]!,
      type,
      specification: `Specification ${globalIndex + 1}`,
      guarantee: {
        start: stamp(2017, ((globalIndex % 12) + 1), 6),
        end: stamp(2018, ((globalIndex % 12) + 1), 6),
      },
      price: [
        { value: usd, symbol: 'USD', isDefault: 0 },
        { value: Number((usd * 41.5).toFixed(2)), symbol: 'UAH', isDefault: 1 },
      ],
      order: order.id,
      date: order.date,
      status,
    }
  })
})

export const productTypes: string[] = [...new Set(products.map((p) => p.type))].sort()
