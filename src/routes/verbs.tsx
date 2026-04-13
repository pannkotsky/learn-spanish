import { useQuery } from '@apollo/client/react'
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

import { VerbFormsMatrix } from '#/components/VerbFormsMatrix'
import { VerbParadigmsSelector } from '#/components/VerbParadigmsSelector'
import {
  type VerbParadigm,
  VerbsPageDocument,
  type VerbsPageQuery,
  type VerbsPageQueryVariables,
  type WordsOrdering,
} from '#/graphql/__generated__/graphql'
import { ALL_PARADIGMS, formatParadigmTitle } from '#/lib/verb-matrix'
import {
  orderedParadigmsFromSelection,
  paradigmsFromParam,
  paradigmsGraphqlVariable,
  paradigmsToParam,
  type VerbsUrlSearch,
  validateVerbsUrlSearch,
} from '#/lib/verbs-url-search'

const PAGE_SIZE = 25

export const Route = createFileRoute('/verbs')({
  validateSearch: validateVerbsUrlSearch,
  component: VerbsShell,
})

function VerbsShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  if (pathname.startsWith('/verbs/quiz')) {
    return <Outlet />
  }
  return <VerbsPage />
}

function VerbsPage() {
  const url = Route.useSearch()
  const navigate = useNavigate({ from: '/verbs' })

  const [searchInput, setSearchInput] = useState(url.search)

  useEffect(() => {
    setSearchInput(url.search)
  }, [url.search])

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (searchInput === url.search) return
      navigate({
        search: (prev: VerbsUrlSearch) => ({
          ...prev,
          search: searchInput,
          page: 0,
        }),
        replace: true,
      })
    }, 350)
    return () => window.clearTimeout(t)
  }, [searchInput, url.search, navigate])

  const columnParadigms = useMemo(() => paradigmsFromParam(url.paradigms), [url.paradigms])

  const selectedSet = useMemo(() => new Set<string>(columnParadigms), [columnParadigms])

  const offset = url.page * PAGE_SIZE

  const paradigmsVariable = useMemo((): VerbParadigm[] | null => {
    return paradigmsGraphqlVariable(columnParadigms)
  }, [columnParadigms])

  const variables = useMemo(
    (): VerbsPageQueryVariables => ({
      search: url.search.length > 0 ? url.search : null,
      offset,
      ordering: url.ordering,
      paradigms: paradigmsVariable ?? undefined,
    }),
    [offset, paradigmsVariable, url.ordering, url.search],
  )

  const { data, loading, error } = useQuery<VerbsPageQuery, VerbsPageQueryVariables>(
    VerbsPageDocument,
    {
      variables,
      notifyOnNetworkStatusChange: true,
    },
  )

  const totalCount = data?.verbs?.totalCount ?? 0
  const verbs = useMemo(() => data?.verbs?.results ?? [], [data?.verbs?.results])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const canPrev = url.page > 0
  const canNext = (url.page + 1) * PAGE_SIZE < totalCount

  function patchSearch(patch: Partial<VerbsUrlSearch>) {
    navigate({
      search: (prev: VerbsUrlSearch) => ({ ...prev, ...patch }),
      replace: true,
    })
  }

  function toggleParadigm(p: string) {
    const next = new Set(selectedSet)
    if (next.has(p)) {
      if (next.size > 1) next.delete(p)
    } else {
      next.add(p)
    }
    const ordered = orderedParadigmsFromSelection(next)
    patchSearch({
      paradigms: paradigmsToParam(ordered),
      page: 0,
    })
  }

  const paradigmTriggerLabel = useMemo(() => {
    const n = columnParadigms.length
    if (n === ALL_PARADIGMS.length) return 'All tenses'
    if (n <= 2) return columnParadigms.map((p) => formatParadigmTitle(p)).join(', ')
    return `${n} tenses`
  }, [columnParadigms])

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Verbs</h1>
          <p className="mt-1 text-sm text-base-content/70">
            Browse verbs with full conjugation tables.
          </p>
        </div>
        <Link to="/verbs/quiz" search={url} className="btn btn-primary btn-sm shrink-0 sm:mt-0.5">
          Take a quiz
        </Link>
      </div>

      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="form-control min-w-0 flex-1">
              <div className="label pt-0 pb-2">
                <span className="label-text font-medium">Search</span>
              </div>
              <input
                type="search"
                placeholder="First letters of the infinitive…"
                className="input input-bordered w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoComplete="off"
              />
            </label>
            <label className="form-control w-full shrink-0 lg:w-52">
              <div className="label pt-0 pb-2">
                <span className="label-text font-medium">Ordering</span>
              </div>
              <select
                className="select select-bordered w-full"
                value={url.ordering}
                onChange={(e) =>
                  patchSearch({
                    ordering: e.target.value as WordsOrdering,
                    page: 0,
                  })
                }
              >
                <option value="FREQUENCY_DESC">Frequency (most common first)</option>
                <option value="MAIN_FORM_ASC">Alphabetical (A–Z)</option>
              </select>
            </label>
            <VerbParadigmsSelector
              triggerLabel={paradigmTriggerLabel}
              selectedSet={selectedSet}
              onToggleParadigm={toggleParadigm}
              triggerAriaLabel="Select tenses to show in tables"
              listboxAriaLabel="Select tenses to show in tables"
            />
          </div>
        </div>
      </div>

      {error ? (
        <div role="alert" className="alert alert-error">
          <span>{error.message}</span>
        </div>
      ) : null}

      {loading && !data ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-lg loading-spinner text-primary" />
        </div>
      ) : null}

      <div className="flex flex-col gap-8">
        {verbs.map((verb) => (
          <article key={verb.id} className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4">
              <header className="border-b border-base-200 pb-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="card-title text-2xl">{verb.mainForm}</h2>
                  <span className="text-base font-normal text-base-content/80">
                    {verb.translationEn}
                  </span>
                </div>
              </header>
              <VerbFormsMatrix verb={verb} columnParadigms={columnParadigms} />
            </div>
          </article>
        ))}
      </div>

      {!loading && verbs.length === 0 ? (
        <div className="alert alert-info">
          <span>No verbs match this search.</span>
        </div>
      ) : null}

      <div className="join flex justify-center border-t border-base-200 pt-4">
        <button
          type="button"
          className="join-item btn btn-outline"
          disabled={!canPrev || loading}
          onClick={() => patchSearch({ page: Math.max(0, url.page - 1) })}
        >
          Previous
        </button>
        <button type="button" className="join-item btn btn-disabled no-animation">
          Page {url.page + 1} of {totalPages}
        </button>
        <button
          type="button"
          className="join-item btn btn-outline"
          disabled={!canNext || loading}
          onClick={() => patchSearch({ page: url.page + 1 })}
        >
          Next
        </button>
      </div>
    </main>
  )
}
