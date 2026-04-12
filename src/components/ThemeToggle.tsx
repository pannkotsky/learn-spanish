import { Moon, Sun } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'

const STORAGE_KEY = 'learn-spanish-theme'

export type ColorTheme = 'light' | 'dark'

function readInitialTheme(): ColorTheme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ColorTheme>(readInitialTheme)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore quota / private mode */
    }
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="btn btn-ghost btn-circle btn-sm"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      onClick={() => setTheme(next)}
    >
      {theme === 'dark' ? (
        <Sun className="size-5 opacity-90" aria-hidden />
      ) : (
        <Moon className="size-5 opacity-90" aria-hidden />
      )}
    </button>
  )
}
