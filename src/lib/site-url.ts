import type { AnyRouteMatch } from '@tanstack/react-router'
import { defaultStringifySearch } from '@tanstack/react-router'

/** Public site origin used for canonical URLs, Open Graph, and sitemap. */
const DEFAULT_PRODUCTION_ORIGIN = 'https://learn-spanish.app'

export const SITE_DESCRIPTION =
  'Practice Spanish verb conjugations: browse a filterable verb list with tense columns, or take a quiz on random forms.'

/**
 * Canonical origin for absolute URLs. Prefer `VITE_APP_URL` (e.g. Railway) so
 * preview and staging use the correct host; fall back to localhost in dev and
 * the production domain in built output.
 */
export function getSiteOrigin(): string {
  const fromEnv = import.meta.env.VITE_APP_URL as string | undefined
  if (fromEnv) {
    try {
      return new URL(fromEnv.replace(/\/$/, '')).origin
    } catch {
      /* ignore invalid URL */
    }
  }
  if (import.meta.env.DEV) return 'http://localhost:3000'
  return DEFAULT_PRODUCTION_ORIGIN
}

export function canonicalUrlFromMatches(
  matches: ReadonlyArray<Pick<AnyRouteMatch, 'pathname' | 'search'>>,
): string {
  const leaf = matches[matches.length - 1]
  if (!leaf) return `${getSiteOrigin()}/`
  const origin = getSiteOrigin()
  const pathname = leaf.pathname.startsWith('/') ? leaf.pathname : `/${leaf.pathname}`
  const search = defaultStringifySearch(leaf.search as Record<string, unknown>)
  return `${origin}${pathname}${search}`
}
