import type { ApolloClientIntegration } from '@apollo/client-integration-tanstack-start'
import { createRootRouteWithContext, HeadContent, Link, Scripts } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '#/lib/auth'
import { AuthUserProvider } from '#/lib/auth-user-context'
import { canonicalUrlFromMatches, getSiteOrigin, SITE_DESCRIPTION } from '#/lib/site-url'
import { getThemeServerFn, inlineThemeScript } from '#/lib/theme'
import { ThemeProvider } from '#/lib/theme-context'

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
    const [session, theme] = await Promise.all([getSessionServerFn(), getThemeServerFn()])
    return { session, theme }
  },
  head: (ctx) => {
    const canonicalUrl = canonicalUrlFromMatches(ctx.matches)
    const ogImage = `${getSiteOrigin()}/logo512.png`
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f2f2f2' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#191e24' },
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Learn Spanish' },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: ogImage },
        { name: 'twitter:title', content: 'Learn Spanish' },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Learn Spanish' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { title: 'Learn Spanish' },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'alternate icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'canonical', href: canonicalUrl },
      ],
    }
  },
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
  const { session, theme } = Route.useLoaderData()

  return (
    <html lang="en" data-theme={theme ?? undefined} suppressHydrationWarning>
      <head>
        {theme === null ? <script dangerouslySetInnerHTML={{ __html: inlineThemeScript }} /> : null}
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col bg-base-200 text-base-content antialiased">
        <ThemeProvider initialTheme={theme}>
          <AuthUserProvider user={session?.user}>
            <AppNavbar />
            <div className="flex flex-1 flex-col">{children}</div>
            <AppFooter />
          </AuthUserProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
