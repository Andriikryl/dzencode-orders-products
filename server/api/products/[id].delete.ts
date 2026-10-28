import { removeProduct } from '../../utils/data'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Product id must be a number' })
  }

  if (!removeProduct(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return { id }
})
