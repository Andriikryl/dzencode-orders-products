import { buildSchema } from 'graphql'
import { orders, products, productTypes } from './data'

export const schema = buildSchema(`
  type Price {
    value: Float!
    symbol: String!
    isDefault: Int!
  }

  type Guarantee {
    start: String!
    end: String!
  }

  type Product {
    id: Int!
    serialNumber: Int!
    isNew: Int!
    photo: String!
    title: String!
    type: String!
    specification: String!
    guarantee: Guarantee!
    price: [Price!]!
    order: Int!
    date: String!
    status: String!
  }

  type Order {
    id: Int!
    title: String!
    date: String!
    description: String!
    products: [Product!]!
    productCount: Int!
    totalUsd: Float!
    totalUah: Float!
  }

  type Query {
    orders: [Order!]!
    order(id: Int!): Order
    products(type: String): [Product!]!
    productTypes: [String!]!
  }
`)

function productsOf(orderId: number) {
  return products.filter((product) => product.order === orderId)
}

function total(orderId: number, symbol: 'USD' | 'UAH') {
  return productsOf(orderId).reduce((sum, product) => {
    const entry = product.price.find((price) => price.symbol === symbol)
    return sum + (entry?.value ?? 0)
  }, 0)
}

function expand(order: (typeof orders)[number]) {
  return {
    ...order,
    products: () => productsOf(order.id),
    productCount: () => productsOf(order.id).length,
    totalUsd: () => total(order.id, 'USD'),
    totalUah: () => total(order.id, 'UAH'),
  }
}

export const rootValue = {
  orders: () => orders.map(expand),
  order: ({ id }: { id: number }) => {
    const found = orders.find((order) => order.id === id)
    return found ? expand(found) : null
  },
  products: ({ type }: { type?: string }) =>
    type ? products.filter((product) => product.type === type) : products,
  productTypes: () => productTypes,
}
