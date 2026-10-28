import { products } from '../utils/data'

export default defineEventHandler((event) => {
  const { type } = getQuery(event)
  if (typeof type === 'string' && type) {
    return products.filter((product) => product.type === type)
  }
  return products
})
