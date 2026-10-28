import { graphql } from 'graphql'
import { rootValue, schema } from '../utils/schema'

interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
  operationName?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<GraphQLRequest>(event)

  if (!body?.query) {
    throw createError({ statusCode: 400, statusMessage: 'Missing query' })
  }

  return graphql({
    schema,
    source: body.query,
    rootValue,
    variableValues: body.variables,
    operationName: body.operationName,
  })
})
