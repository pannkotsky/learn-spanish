import { Moon, Sun } from 'lucide-react'

import { useTheme } from '#/lib/theme-context'

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme()

  // theme === null means the server had no cookie and the inline script resolved
  // data-theme from OS preference. Omit the icon on the first render so server
  // HTML and client hydration match; the mount effect will then set it.
  const showIcon = theme !== null
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      className="btn btn-ghost btn-circle btn-sm"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      onClick={toggleTheme}
    >
      {showIcon ? (
        isDark ? (
          <Sun className="size-5 opacity-90" aria-hidden />
        ) : (
          <Moon className="size-5 opacity-90" aria-hidden />
        )
      ) : (
        <span className="size-5" aria-hidden />
      )}
    </button>
  )
}
