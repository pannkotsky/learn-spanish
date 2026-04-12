import { Conjugator, type Result } from '@jirimracek/conjugate-esp'

import { ALL_PARADIGMS } from '#/lib/verb-matrix'

import type { VerbParadigm } from './schema'

type ResultTable = Result['conjugation']

/** Same paradigms and order as `ALL_PARADIGMS` (usage-based UI order). */
export const VERB_PARADIGMS = ALL_PARADIGMS

function sixFromPersons(arr: string[]) {
  const g = (i: number) => (arr[i] ?? '-').trim() || '-'
  return {
    firstPersonSingular: g(0),
    secondPersonSingular: g(1),
    thirdPersonSingular: g(2),
    firstPersonPlural: g(3),
    secondPersonPlural: g(4),
    thirdPersonPlural: g(5),
  }
}

function sixSame(form: string) {
  const s = form.trim() || '-'
  return {
    firstPersonSingular: s,
    secondPersonSingular: s,
    thirdPersonSingular: s,
    firstPersonPlural: s,
    secondPersonPlural: s,
    thirdPersonPlural: s,
  }
}

/**
 * Maps our DB enum to conjugation-esp `ResultTable` paths.
 * Subjunctive compound pluperfect uses the -ra stem series (see schema note).
 */
export function cellsForParadigm(
  paradigm: VerbParadigm,
  t: ResultTable,
): ReturnType<typeof sixFromPersons> {
  switch (paradigm) {
    case 'indicative_present':
      return sixFromPersons(t.Indicativo.Presente)
    case 'indicative_preterite':
      return sixFromPersons(t.Indicativo.PreteritoIndefinido)
    case 'indicative_imperfect':
      return sixFromPersons(t.Indicativo.PreteritoImperfecto)
    case 'indicative_future':
      return sixFromPersons(t.Indicativo.FuturoImperfecto)
    case 'indicative_conditional':
      return sixFromPersons(t.Indicativo.CondicionalSimple)
    case 'indicative_present_perfect':
      return sixFromPersons(t.Indicativo.PreteritoPerfecto)
    case 'indicative_pluperfect':
      return sixFromPersons(t.Indicativo.PreteritoPluscuamperfecto)
    case 'indicative_future_perfect':
      return sixFromPersons(t.Indicativo.FuturoPerfecto)
    case 'indicative_conditional_perfect':
      return sixFromPersons(t.Indicativo.CondicionalCompuesto)
    case 'indicative_past_anterior':
      return sixFromPersons(t.Indicativo.PreteritoAnterior)
    case 'subjunctive_present':
      return sixFromPersons(t.Subjuntivo.Presente)
    case 'subjunctive_imperfect_ra':
      return sixFromPersons(t.Subjuntivo.PreteritoImperfectoRa)
    case 'subjunctive_imperfect_se':
      return sixFromPersons(t.Subjuntivo.PreteritoImperfectoSe)
    case 'subjunctive_future':
      return sixFromPersons(t.Subjuntivo.FuturoImperfecto)
    case 'subjunctive_present_perfect':
      return sixFromPersons(t.Subjuntivo.PreteritoPerfecto)
    case 'subjunctive_pluperfect':
      return sixFromPersons(t.Subjuntivo.PreteritoPluscuamperfectoRa)
    case 'imperative_affirmative':
      return sixFromPersons(t.Imperativo.Afirmativo)
    case 'imperative_negative':
      return sixFromPersons(t.Imperativo.Negativo)
    case 'gerund':
      return sixSame(t.Impersonal.Gerundio)
    default: {
      const _exhaustive: never = paradigm
      return sixSame(String(_exhaustive))
    }
  }
}

/** Unique surface strings (lowercased) across all stored paradigms for one lemma. */
export function surfaceFormsForLemma(
  mainForm: string,
  conjugator: Conjugator,
): { ok: true; forms: ReadonlySet<string> } | { ok: false; error: string } {
  const raw = conjugator.conjugateSync(mainForm, 'castellano')
  if (typeof raw === 'string') return { ok: false, error: raw }
  const table = raw[0].conjugation
  const set = new Set<string>()
  for (const paradigm of VERB_PARADIGMS) {
    const cells = cellsForParadigm(paradigm, table)
    for (const v of Object.values(cells)) {
      const t = v.trim().toLowerCase()
      if (!t || t === '-') continue
      set.add(t)
    }
  }
  return { ok: true, forms: set }
}
