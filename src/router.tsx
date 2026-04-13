import { routerWithApolloClient } from '@apollo/client-integration-tanstack-start'
import {
  createRouter as createTanStackRouter,
  defaultStringifySearch,
} from '@tanstack/react-router'

import { makeApolloClient } from '#/graphql/apollo-client'
import {
  isVerbsUrlSearchRecord,
  validateVerbsUrlSearch,
  verbSearchToMinimalQuery,
} from '#/lib/verbs-url-search'

import { routeTree } from './routeTree.gen'

function stringifySearch(search: Record<string, unknown>): string {
  if (!search || typeof search !== 'object') {
    return defaultStringifySearch(search as never)
  }
  if (!isVerbsUrlSearchRecord(search)) {
    return defaultStringifySearch(search as never)
  }
  try {
    const full = validateVerbsUrlSearch(search)
    const minimal = verbSearchToMinimalQuery(full)
    return defaultStringifySearch(minimal as Record<string, unknown>)
  } catch {
    return defaultStringifySearch(search as never)
  }
}

export function getRouter() {
  const apolloClient = makeApolloClient()
  const context = routerWithApolloClient.defaultContext

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    stringifySearch,
  })

  return routerWithApolloClient(router, apolloClient)
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
