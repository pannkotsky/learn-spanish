import { createFileRoute, Link } from '@tanstack/react-router'

import { changelogHtml } from '#/generated/changelog-html'

export const Route = createFileRoute('/changelog')({
  component: ChangelogPage,
})

const changelogProseClass =
  'prose prose-neutral max-w-none ' +
  'prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-base-content ' +
  'prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-xl prose-h2:border-b prose-h2:border-base-300 prose-h2:pb-2 ' +
  'prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-lg ' +
  'prose-p:leading-relaxed prose-p:text-base-content/85 ' +
  'prose-a:font-medium prose-a:text-primary prose-a:no-underline [&_a]:underline-offset-2 [&_a:hover]:underline ' +
  'prose-strong:font-semibold prose-strong:text-base-content ' +
  'prose-ul:my-4 prose-li:my-1 prose-li:text-base-content/85 prose-li:marker:text-base-content/45'

function ChangelogPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6 pb-12">
      <div>
        <p className="mb-2 text-sm text-base-content/60">
          <Link to="/" className="link link-hover">
            Home
          </Link>
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-base-content">Changelog</h1>
        <p className="mt-2 text-sm text-base-content/60">Release notes for this application.</p>
      </div>

      <article className="rounded-box border border-base-300 bg-base-200/40 p-6 sm:p-8">
        <div
          className={changelogProseClass}
          // Trusted app-owned markdown compiled at build time (see scripts/build-changelog-html.ts).
          dangerouslySetInnerHTML={{ __html: changelogHtml }}
        />
      </article>
    </main>
  )
}
