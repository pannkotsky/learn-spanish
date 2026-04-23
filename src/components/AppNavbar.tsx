import { Link } from '@tanstack/react-router'

import { PwaInstallButton } from '#/components/PwaInstallButton'
import { ThemeToggle } from '#/components/ThemeToggle'
import { verbsRouteDefaultSearch } from '#/lib/verbs-url-search'

import { AccountMenu } from './AccountMenu'

export default function AppNavbar() {
  return (
    <header className="navbar border-b border-base-300 bg-base-100 px-4 shadow-sm">
      <div className="flex flex-1 items-center gap-1">
        <Link to="/" className="btn btn-ghost gap-2 px-2 text-lg font-semibold normal-case">
          <img
            src="/logo192.png"
            alt="Learn Spanish"
            className="h-6 w-6 shrink-0 rounded-full"
            aria-hidden="true"
          />
          <span>Learn Spanish</span>
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
        <PwaInstallButton />
        <AccountMenu />
        <ThemeToggle />
      </div>
    </header>
  )
}
