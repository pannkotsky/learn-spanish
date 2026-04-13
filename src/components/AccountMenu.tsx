import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'

import { authClient } from '#/lib/auth-client'
import { useAuthUser } from '#/lib/auth-user-context'

export function AccountMenu() {
  const user = useAuthUser()
  if (!user) {
    return (
      <Link to="/login" className="btn btn-primary btn-sm">
        Log in
      </Link>
    )
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost gap-1 normal-case"
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span className="max-w-48 truncate font-medium">{user.name}</span>
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
  )
}
