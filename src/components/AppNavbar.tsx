import { Link } from '@tanstack/react-router'

import { ThemeToggle } from '#/components/ThemeToggle'
import { verbsRouteDefaultSearch } from '#/lib/verbs-url-search'

import { AccountMenu } from './AccountMenu'

export default function AppNavbar() {
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
        <AccountMenu />
        <ThemeToggle />
      </div>
    </header>
  )
}
