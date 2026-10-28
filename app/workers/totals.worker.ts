import type { Product } from '~/types'

export interface TotalsRequest {
  products: Product[]
}

export interface OrderTotals {
  orderId: number
  count: number
  usd: number
  uah: number
}

export interface TotalsResponse {
  totals: OrderTotals[]
  grandUsd: number
  grandUah: number
}

self.onmessage = (event: MessageEvent<TotalsRequest>) => {
  const byOrder = new Map<number, OrderTotals>()
  let grandUsd = 0
  let grandUah = 0

  for (const product of event.data.products) {
    const entry = byOrder.get(product.order) ?? {
      orderId: product.order,
      count: 0,
      usd: 0,
      uah: 0,
    }

    const usd = product.price.find((price) => price.symbol === 'USD')?.value ?? 0
    const uah = product.price.find((price) => price.symbol === 'UAH')?.value ?? 0

    entry.count += 1
    entry.usd += usd
    entry.uah += uah
    grandUsd += usd
    grandUah += uah

    byOrder.set(product.order, entry)
  }

  const response: TotalsResponse = {
    totals: [...byOrder.values()].sort((a, b) => b.uah - a.uah),
    grandUsd,
    grandUah,
  }

  self.postMessage(response)
}
