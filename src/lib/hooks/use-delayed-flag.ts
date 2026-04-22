import { useEffect, useState } from 'react'

/**
 * Mirrors `value`, but only flips to `true` after it has stayed `true`
 * for at least `delayMs`. Going back to `false` is always immediate.
 *
 * Useful for avoiding loading/stale indicators that would flash for fast
 * state transitions.
 */
export function useDelayedFlag(value: boolean, delayMs = 200): boolean {
  const [delayed, setDelayed] = useState(false)

  useEffect(() => {
    if (!value) {
      setDelayed(false)
      return
    }
    const t = window.setTimeout(() => setDelayed(true), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])

  return delayed
}
