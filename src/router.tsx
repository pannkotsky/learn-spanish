import {
  createRouter as createTanStackRouter,
  defaultStringifySearch,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import {
  isVerbsUrlSearchRecord,
  validateVerbsUrlSearch,
  verbSearchToMinimalQuery,
} from '#/lib/verbs-url-search'
import { getContext } from './integrations/tanstack-query/root-provider'

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
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    stringifySearch,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
