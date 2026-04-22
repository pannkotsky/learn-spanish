import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { type ColorTheme, isColorTheme, THEME_COOKIE } from './theme'

type ThemeContextValue = {
  // null only during the brief first-visit-no-cookie window before the mount effect runs.
  theme: ColorTheme | null
  resolvedTheme: ColorTheme
  setTheme: (theme: ColorTheme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

function persistThemeCookie(theme: ColorTheme) {
  document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: ColorTheme | null
  children: ReactNode
}) {
  const [theme, setThemeState] = useState<ColorTheme | null>(initialTheme)

  // When the server didn't have a cookie, the inline script in <head> set
  // data-theme from the OS preference before paint. Sync React state to it
  // after mount so subsequent renders match the DOM.
  useEffect(() => {
    if (theme !== null) return
    const fromDom = document.documentElement.getAttribute('data-theme')
    if (isColorTheme(fromDom)) {
      setThemeState(fromDom)
      persistThemeCookie(fromDom)
    }
  }, [theme])

  const setTheme = useCallback((next: ColorTheme) => {
    setThemeState(next)
    document.documentElement.setAttribute('data-theme', next)
    persistThemeCookie(next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme ?? 'light',
      setTheme,
      toggleTheme: () => setTheme((theme ?? 'light') === 'dark' ? 'light' : 'dark'),
    }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}
