import { removeOrder } from '../../utils/data'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Order id must be a number' })
  }

  if (!removeOrder(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  return { id }
})
