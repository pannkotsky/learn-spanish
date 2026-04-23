import { Download } from 'lucide-react'
import { useEffect } from 'react'

import { useInstallPrompt } from '#/lib/use-install-prompt'

export function PwaInstallButton() {
  const { canInstall, install } = useInstallPrompt()

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
    // Skip in dev: the Vite dev server serves non-hashed modules and HMR that
    // do not play well with a service worker cache.
    if (import.meta.env.DEV) return
    void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      /* registration failures are non-fatal; install prompt just won't show */
    })
  }, [])

  if (!canInstall) return null

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm gap-2 normal-case"
      title="Install app"
      onClick={() => void install()}
    >
      <Download className="size-5 shrink-0 opacity-90" aria-hidden />
      <span>Install app</span>
    </button>
  )
}
