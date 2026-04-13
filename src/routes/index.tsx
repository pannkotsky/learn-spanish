import { createFileRoute, Link } from '@tanstack/react-router'

import { verbsRouteDefaultSearch } from '#/lib/verbs-url-search'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-base-content">
          Learn Spanish verbs
        </h1>
        <p className="text-base leading-relaxed text-base-content/80">
          Practice Spanish conjugations in your browser. Look up verbs in a table tailored to the
          tenses you care about, or drill with a short quiz that asks for one form at a time.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-base-content">What you can do here</h2>
        <ul className="list-inside list-disc space-y-2 text-base text-base-content/80">
          <li>
            <strong className="font-medium text-base-content">Verb list</strong> — browse verbs with
            a conjugation matrix, filter by spelling, reorder by frequency or infinitive, and choose
            which tense columns to show.
          </li>
          <li>
            <strong className="font-medium text-base-content">Quiz</strong> — get a random verb and
            answer for a single person and tense; pick the same tense set as on the list page.
          </li>
        </ul>
        <p className="m-0 text-base leading-relaxed text-base-content/80">
          Verbs are the focus for now; other kinds of Spanish learning activities may be added
          later.
        </p>
        <p className="m-0 text-base leading-relaxed text-base-content/80">
          Signing up or logging in is optional today. Later, an account is planned to help track
          your learning progress and suggest the exercises that are most useful for you.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
          <Link
            to="/verbs"
            search={verbsRouteDefaultSearch}
            className="btn btn-primary sm:btn-wide"
          >
            Open verb list
          </Link>
          <Link
            to="/verbs/quiz"
            search={verbsRouteDefaultSearch}
            className="btn btn-outline sm:btn-wide"
          >
            Take a quiz
          </Link>
        </div>
      </section>
    </main>
  )
}
