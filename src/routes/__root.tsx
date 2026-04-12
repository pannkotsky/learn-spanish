import { HeadContent, Link, Scripts, createRootRouteWithContext } from '@tanstack/react-router'

import { ApolloClientProvider } from '../components/ApolloClientProvider'
import AppNavbar from '../components/AppNavbar'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Learn Spanish' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-base-content/70">
        That URL does not match any page. Check the address or go back to the home page.
      </p>
      <Link to="/" className="btn btn-primary btn-wide w-fit">
        Home
      </Link>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col bg-base-200 text-base-content antialiased">
        <ApolloClientProvider>
          <AppNavbar />
          <div className="flex flex-1 flex-col">{children}</div>
        </ApolloClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
