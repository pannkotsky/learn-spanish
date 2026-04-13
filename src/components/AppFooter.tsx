import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'

import { contactEmail } from '#/lib/contact-email'

const GITHUB_NEW_ISSUE_URL = 'https://github.com/pannkotsky/learn-spanish/issues/new'

export default function AppFooter() {
  return (
    <footer className="border-t border-base-300 bg-base-100 px-4 py-4 text-sm text-base-content/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a
            className="link link-hover inline-flex items-center gap-1.5 font-medium text-base-content"
            href={`mailto:${contactEmail}`}
          >
            <Mail className="size-3.5 shrink-0 opacity-70" aria-hidden />
            {contactEmail}
          </a>
          <span className="size-1 shrink-0 rounded-full bg-base-content/35" aria-hidden />
          <a
            className="link link-hover inline-flex items-center gap-1.5 font-medium text-base-content"
            href={GITHUB_NEW_ISSUE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open an issue on GitHub
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <Link to="/privacy" className="link link-hover font-medium text-base-content">
            Privacy
          </Link>
          <span className="size-1 shrink-0 rounded-full bg-base-content/35" aria-hidden />
          <Link to="/terms" className="link link-hover font-medium text-base-content">
            Terms of use
          </Link>
        </div>
        <p className="m-0 text-center text-base-content/60">
          © {new Date().getFullYear()} Valerii Kovalchuk
        </p>
      </div>
    </footer>
  )
}
