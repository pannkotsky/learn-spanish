import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'

import { ThemeToggle } from '#/components/ThemeToggle'
import { authClient } from '#/lib/auth-client'
import { verbsRouteDefaultSearch } from '#/lib/verbs-url-search'

export default function AppNavbar() {
  const { data: session, isPending } = authClient.useSession()

  const displayName =
    session?.user?.name?.trim() || session?.user?.email?.split('@')[0] || 'Account'

  return (
    <header className="navbar border-b border-base-300 bg-base-100 px-4 shadow-sm">
      <div className="flex flex-1 items-center gap-1">
        <Link to="/" className="btn btn-ghost text-lg font-semibold normal-case">
          Learn Spanish
        </Link>
        <Link
          to="/verbs"
          search={verbsRouteDefaultSearch}
          className="btn btn-ghost btn-sm normal-case"
        >
          Verbs
        </Link>
      </div>
      <div className="flex flex-none items-center gap-2">
        {isPending ? (
          <span className="loading loading-spinner loading-sm text-base-content/50" />
        ) : session?.user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost gap-1 normal-case"
              aria-haspopup="menu"
              aria-label="Account menu"
            >
              <span className="max-w-48 truncate font-medium">{displayName}</span>
              <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box z-50 mt-2 w-52 border border-base-300 bg-base-100 p-2 shadow-lg"
              role="menu"
            >
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="text-error"
                  onClick={() => {
                    void authClient.signOut({
                      fetchOptions: { onSuccess: () => window.location.assign('/') },
                    })
                  }}
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Log in
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
