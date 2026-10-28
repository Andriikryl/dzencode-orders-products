export type CurrencySymbol = 'USD' | 'UAH'

export interface Price {
  value: number
  symbol: CurrencySymbol
  isDefault: 0 | 1
}

export interface Guarantee {
  start: string
  end: string
}

export type ProductStatus = 'free' | 'in-repair'

export interface Product {
  id: number
  serialNumber: number
  isNew: 0 | 1
  photo: string
  title: string
  type: string
  specification: string
  guarantee: Guarantee
  price: Price[]
  order: number
  date: string
  status: ProductStatus
}

export interface Order {
  id: number
  title: string
  date: string
  description: string
}

export interface OrderWithProducts extends Order {
  products: Product[]
}
