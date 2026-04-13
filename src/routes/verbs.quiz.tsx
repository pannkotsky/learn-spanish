import { NetworkStatus } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { VerbParadigmsSelector } from '#/components/VerbParadigmsSelector'
import {
  type VerbParadigm,
  VerbQuizRandomVerbDocument,
  type VerbQuizRandomVerbQuery,
} from '#/graphql/__generated__/graphql'
import { ALL_PARADIGMS, formatParadigmTitle } from '#/lib/verb-matrix'
import {
  pickVerbQuizQuestionFromFetchedVerb,
  randomParadigmFromSelection,
  type VerbQuizAttempt,
  type VerbQuizQuestion,
  verbAnswersMatch,
} from '#/lib/verb-quiz'
import {
  orderedParadigmsFromSelection,
  paradigmsFromParam,
  paradigmsToParam,
  type VerbsUrlSearch,
  validateVerbsUrlSearch,
} from '#/lib/verbs-url-search'

type VerbRow = VerbQuizRandomVerbQuery['verbs']['results'][number]

export const Route = createFileRoute('/verbs/quiz')({
  validateSearch: validateVerbsUrlSearch,
  component: VerbQuizPage,
})

function VerbQuizPage() {
  const url = Route.useSearch()
  const navigate = useNavigate({ from: '/verbs/quiz' })

  const columnParadigms = useMemo(() => paradigmsFromParam(url.paradigms), [url.paradigms])
  const selectedSet = useMemo(() => new Set<string>(columnParadigms), [columnParadigms])

  const [queryParadigm, setQueryParadigm] = useState<VerbParadigm | null>(null)

  useEffect(() => {
    const cols = paradigmsFromParam(url.paradigms)
    setQueryParadigm(randomParadigmFromSelection(cols))
    setQuestion(null)
  }, [url.paradigms])

  const { data, loading, error, refetch, networkStatus } = useQuery(VerbQuizRandomVerbDocument, {
    variables: { paradigm: queryParadigm ?? ('indicative_present' as VerbParadigm) },
    skip: queryParadigm == null,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  })
  const verbs = useMemo(() => data?.verbs?.results ?? [], [data?.verbs?.results])
  const isRefetching = networkStatus === NetworkStatus.refetch

  const [phase, setPhase] = useState<'active' | 'finished'>('active')
  const [attempts, setAttempts] = useState<VerbQuizAttempt[]>([])
  const [question, setQuestion] = useState<VerbQuizQuestion | null>(null)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)

  const applyQuestionFromVerb = useCallback((verb: VerbRow | undefined) => {
    const q = pickVerbQuizQuestionFromFetchedVerb(verb)
    setQuestion(q)
    setAnswer('')
    setSubmitted(false)
    setLastCorrect(null)
  }, [])

  useEffect(() => {
    if (loading || phase !== 'active') return
    if (question != null) return
    if (verbs.length === 0) return
    applyQuestionFromVerb(verbs[0] as VerbRow | undefined)
  }, [loading, phase, question, verbs, applyQuestionFromVerb])

  const fetchAndApplyVerb = useCallback(async () => {
    const paradigm = randomParadigmFromSelection(columnParadigms)
    const { data: next } = await refetch({ paradigm })
    setQueryParadigm(paradigm)
    const row = next?.verbs?.results?.[0] as VerbRow | undefined
    applyQuestionFromVerb(row)
  }, [refetch, applyQuestionFromVerb, columnParadigms])

  const correctCount = useMemo(() => attempts.filter((a) => a.isCorrect).length, [attempts])

  const paradigmTriggerLabel = useMemo(() => {
    const n = columnParadigms.length
    if (n === ALL_PARADIGMS.length) return 'All tenses'
    if (n <= 2) return columnParadigms.map((p) => formatParadigmTitle(p)).join(', ')
    return `${n} tenses`
  }, [columnParadigms])

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
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question || submitted) return
    const trimmed = answer.trim()
    if (trimmed.length === 0) return
    const ok = verbAnswersMatch(question.correctAnswer, trimmed)
    setSubmitted(true)
    setLastCorrect(ok)
    setAttempts((prev) => [
      ...prev,
      {
        verbMainForm: question.verb.mainForm,
        paradigmLabel: question.paradigmLabel,
        personLabel: question.personLabel,
        userAnswer: trimmed,
        correctAnswer: question.correctAnswer,
        isCorrect: ok,
      },
    ])
  }

  function handleNext() {
    if (!submitted || isRefetching) return
    void fetchAndApplyVerb()
  }

  function handleFinish() {
    setPhase('finished')
  }

  function handlePracticeAgain() {
    setAttempts([])
    setPhase('active')
    void fetchAndApplyVerb()
  }

  if (error) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 md:p-6">
        <div role="alert" className="alert alert-error">
          <span>{error.message}</span>
        </div>
        <Link to="/verbs" search={url} className="btn btn-outline w-fit">
          Back to verbs
        </Link>
      </main>
    )
  }

  if (loading && !data) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 p-8 md:p-12">
        <span className="loading loading-lg loading-spinner text-primary" />
        <p className="text-sm text-base-content/70">Loading verbs…</p>
      </main>
    )
  }

  if (!loading && (data?.verbs?.totalCount ?? 0) === 0) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 md:p-6">
        <div className="alert alert-info">
          <span>There are no verbs to quiz yet. Add or seed verbs first.</span>
        </div>
        <Link to="/verbs" search={url} className="btn btn-primary w-fit">
          Back to verbs
        </Link>
      </main>
    )
  }

  if (phase === 'finished') {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Quiz finished</h1>
          <Link to="/verbs" search={url} className="btn btn-ghost btn-sm w-fit">
            Back to verbs
          </Link>
        </div>
        <p className="text-lg">
          <span className="font-medium text-success">{correctCount}</span> correct out of{' '}
          <span className="font-medium">{attempts.length}</span> submitted.
        </p>
        {attempts.length === 0 ? (
          <p className="text-base-content/70">You did not submit any answers in this run.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-base-300">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>Verb</th>
                  <th>Tense</th>
                  <th>Person</th>
                  <th>Your answer</th>
                  <th>Correct</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => (
                  <tr key={`${a.verbMainForm}-${i}-${a.personLabel}`}>
                    <td className="whitespace-nowrap font-medium">{a.verbMainForm}</td>
                    <td>{a.paradigmLabel}</td>
                    <td className="whitespace-nowrap">{a.personLabel}</td>
                    <td>{a.userAnswer}</td>
                    <td>{a.correctAnswer}</td>
                    <td>
                      {a.isCorrect ? (
                        <span className="text-success">Correct</span>
                      ) : (
                        <span className="text-error">Incorrect</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={handlePracticeAgain}>
            Practice again
          </button>
          <Link to="/verbs" search={url} className="btn btn-outline">
            Back to verbs
          </Link>
        </div>
      </main>
    )
  }

  if (question == null && !loading) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 md:p-6">
        <div className="alert alert-warning">
          <span>Could not build a prompt from this verb. Try another random verb.</span>
        </div>
        <button
          type="button"
          className="btn btn-primary w-fit"
          onClick={() => void fetchAndApplyVerb()}
        >
          Retry
        </button>
        <Link to="/verbs" search={url} className="btn btn-ghost w-fit">
          Back to verbs
        </Link>
      </main>
    )
  }

  if (!question) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 p-8">
        <span className="loading loading-lg loading-spinner text-primary" />
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Verb conjugation quiz</h1>
        <Link to="/verbs" search={url} className="btn btn-ghost btn-sm w-fit">
          Back to verbs
        </Link>
      </div>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-2 py-4">
          <VerbParadigmsSelector
            triggerLabel={paradigmTriggerLabel}
            selectedSet={selectedSet}
            onToggleParadigm={toggleParadigm}
            triggerAriaLabel="Select tenses for the quiz"
            listboxAriaLabel="Select tenses for the quiz"
          />
          <p className="text-xs text-base-content/60">
            Only checked tenses are used. Changing the selection loads a new random verb for the
            next question.
          </p>
        </div>
      </div>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <header className="border-b border-base-200 pb-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="card-title text-2xl">{question.verb.mainForm}</h2>
              <span className="text-base font-normal text-base-content/80">
                {question.verb.translationEn}
              </span>
            </div>
          </header>
          <p className="text-base leading-relaxed">
            Give the <span className="font-medium">{question.paradigmLabel}</span> form for{' '}
            <span className="font-medium">{question.personLabel}</span>.
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                className={`input input-bordered min-w-0 flex-1 basis-48 ${submitted ? 'cursor-default' : ''}`}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                readOnly={submitted}
                autoComplete="off"
                spellCheck={false}
                placeholder="Type the conjugated form…"
                aria-label="Answer"
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  if (submitted) {
                    e.preventDefault()
                    if (!isRefetching) handleNext()
                    return
                  }
                  if (answer.trim().length === 0) {
                    e.preventDefault()
                  }
                }}
              />
              {!submitted ? (
                <button
                  type="submit"
                  className="btn btn-primary shrink-0"
                  disabled={answer.trim().length === 0}
                >
                  Check answer
                </button>
              ) : null}
            </div>
          </form>
          {submitted && lastCorrect !== null ? (
            <div className={`alert ${lastCorrect ? 'alert-success' : 'alert-warning'}`}>
              {lastCorrect ? (
                <span>Correct — well done.</span>
              ) : (
                <span>
                  Not quite. You entered{' '}
                  <span className="font-mono font-semibold">{answer.trim()}</span>; the expected
                  form is <span className="font-mono font-semibold">{question.correctAnswer}</span>.
                </span>
              )}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2 border-t border-base-200 pt-4">
            <button
              type="button"
              className="btn btn-outline"
              disabled={!submitted || isRefetching}
              onClick={handleNext}
            >
              {isRefetching ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Next question'
              )}
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleFinish}>
              Finish quiz
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-base-content/50">
        Each prompt loads one random verb and only one tense column from the server. Person is
        chosen in the browser.
        {data?.verbs?.totalCount != null
          ? ` (${data.verbs.totalCount} verbs in the database.)`
          : null}
      </p>
    </main>
  )
}
