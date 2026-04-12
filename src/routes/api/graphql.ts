import { createFileRoute } from '@tanstack/react-router'

import { db } from '#/db/index'
import { apolloServer, ensureApolloServerStarted } from '#/graphql/apollo-server'
import type { GqlContext } from '#/graphql/context'
import {
  fetchRequestToHttpGraphQLRequest,
  httpGraphQLResponseToFetchResponse,
} from '#/graphql/http-graphql'
import { createLoaders } from '#/graphql/loaders'

async function handleGraphQL(request: Request) {
  await ensureApolloServerStarted()

  const httpGraphQLRequest = await fetchRequestToHttpGraphQLRequest(request)

  const httpGraphQLResponse = await apolloServer.executeHTTPGraphQLRequest({
    httpGraphQLRequest,
    context: async (): Promise<GqlContext> => ({
      db,
      loaders: createLoaders(db),
    }),
  })

  return httpGraphQLResponseToFetchResponse(httpGraphQLResponse)
}

export const Route = createFileRoute('/api/graphql')({
  server: {
    handlers: {
      GET: ({ request }) => handleGraphQL(request),
      POST: ({ request }) => handleGraphQL(request),
    },
  },
})
