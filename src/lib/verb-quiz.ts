import type { VerbParadigm } from '#/graphql/__generated__/graphql'

import { ALL_PARADIGMS, type PersonKey, PERSON_ROWS, formatParadigmTitle } from '#/lib/verb-matrix'

export type VerbQuizVerb = {
  id: string
  mainForm: string
  translationEn: string
  forms: Array<{
    paradigm: string
    firstPersonSingular: string
    firstPersonPlural: string
    secondPersonSingular: string
    secondPersonPlural: string
    thirdPersonSingular: string
    thirdPersonPlural: string
  }>
}

export type VerbQuizQuestion = {
  verb: VerbQuizVerb
  paradigm: string
  paradigmLabel: string
  personKey: PersonKey
  personLabel: string
  correctAnswer: string
}

export type VerbQuizAttempt = {
  verbMainForm: string
  paradigmLabel: string
  personLabel: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

export function normalizeVerbAnswer(s: string): string {
  return s.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ')
}

export function verbAnswersMatch(expected: string, entered: string): boolean {
  return normalizeVerbAnswer(expected) === normalizeVerbAnswer(entered)
}

function isBlankCell(value: string): boolean {
  const t = value.trim()
  return t.length === 0 || t === '—' || t === '-' || t === '–'
}

/** Picks a random paradigm slug from the URL-selected list (must be non-empty). */
export function randomParadigmFromSelection(allowed: readonly string[]): VerbParadigm {
  if (allowed.length === 0) {
    return ALL_PARADIGMS[0] as VerbParadigm
  }
  const i = Math.floor(Math.random() * allowed.length)
  return allowed[i] as VerbParadigm
}

/**
 * Builds a quiz prompt from a verb whose `forms` were loaded for **one** paradigm only
 * (GraphQL `forms(paradigms: [$paradigm])`). Chooses a random person with a non-empty cell.
 */
export function pickVerbQuizQuestionFromFetchedVerb(
  verb: VerbQuizVerb | undefined,
): VerbQuizQuestion | null {
  if (!verb || verb.forms.length === 0) return null
  const form = verb.forms[0]!
  const paradigm = form.paradigm
  for (let attempt = 0; attempt < 40; attempt++) {
    const personRow = PERSON_ROWS[Math.floor(Math.random() * PERSON_ROWS.length)]!
    const correct = form[personRow.key]
    if (correct == null || isBlankCell(correct)) continue
    return {
      verb,
      paradigm,
      paradigmLabel: formatParadigmTitle(paradigm),
      personKey: personRow.key,
      personLabel: personRow.label,
      correctAnswer: correct.trim(),
    }
  }
  return null
}
