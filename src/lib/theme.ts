import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const THEME_COOKIE = 'theme'

export type ColorTheme = 'light' | 'dark'

export function isColorTheme(value: unknown): value is ColorTheme {
  return value === 'light' || value === 'dark'
}

export const getThemeServerFn = createServerFn({ method: 'GET' }).handler((): ColorTheme | null => {
  const value = getCookie(THEME_COOKIE)
  return isColorTheme(value) ? value : null
})

// Runs synchronously in <head> before CSS is applied. Only sets data-theme when
// the server couldn't (no cookie yet) so we pick up the user's OS preference on
// the very first visit without a flash. React state stays in sync via mount effect.
export const inlineThemeScript = `(() => {
  try {
    const el = document.documentElement;
    if (!el.getAttribute('data-theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      el.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  } catch {}
})();`
