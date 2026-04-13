import type { ApolloClientIntegration } from '@apollo/client-integration-tanstack-start'
import { createRootRouteWithContext, HeadContent, Link, Scripts } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '#/lib/auth'
import { AuthUserProvider } from '#/lib/auth-user-context'

import { ApolloClientProvider } from '../components/ApolloClientProvider'
import AppFooter from '../components/AppFooter'
import AppNavbar from '../components/AppNavbar'
import appCss from '../styles.css?url'

type MyRouterContext = ApolloClientIntegration.RouterContext

const getSessionServerFn = createServerFn({ method: 'GET' }).handler(() =>
  auth.api.getSession({
    headers: getRequestHeaders(),
  }),
)

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async () => {
    const session = await getSessionServerFn()
    return { session }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'description',
        content:
          'Practice Spanish verb conjugations: browse a filterable verb list with tense columns, or take a quiz on random forms.',
      },
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
  const { session } = Route.useLoaderData()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col bg-base-200 text-base-content antialiased">
        <ApolloClientProvider>
          <AuthUserProvider user={session?.user}>
            <AppNavbar />
            <div className="flex flex-1 flex-col">{children}</div>
            <AppFooter />
          </AuthUserProvider>
        </ApolloClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
