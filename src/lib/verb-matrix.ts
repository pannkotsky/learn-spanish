import type { VerbParadigm as SchemaVerbParadigm } from '#/db/schema'

/**
 * Column / checkbox order on `/verbs`: roughly **communicative frequency** —
 * core indicative tenses and imperatives first, then subjunctive, **gerund**,
 * then compound/rarer tenses (literary `past_anterior` last). Infinitive and
 * past participle are omitted (lemma lives on `words.main_form`).
 *
 * Must list every `verb_paradigm` enum member exactly once (see unit test).
 */
export const ALL_PARADIGMS = [
  'indicative_present',
  'indicative_preterite',
  'indicative_present_perfect',
  'gerund',
  'indicative_imperfect',
  'imperative_affirmative',
  'imperative_negative',
  'indicative_future',
  'indicative_conditional',
  'subjunctive_present',
  'indicative_pluperfect',
  'subjunctive_imperfect_ra',
  'subjunctive_imperfect_se',
  'subjunctive_present_perfect',
  'subjunctive_pluperfect',
  'indicative_future_perfect',
  'indicative_conditional_perfect',
  'subjunctive_future',
  'indicative_past_anterior',
] as const satisfies readonly SchemaVerbParadigm[]

export type VerbParadigm = (typeof ALL_PARADIGMS)[number]

/** First four paradigms in `ALL_PARADIGMS` order; default `/verbs` columns when `paradigms` is omitted. */
export const DEFAULT_VERBS_URL_PARADIGMS: readonly VerbParadigm[] = ALL_PARADIGMS.slice(
  0,
  4,
) as readonly VerbParadigm[]

export const PERSON_ROWS = [
  { key: 'firstPersonSingular', label: 'yo' },
  { key: 'secondPersonSingular', label: 'tú' },
  { key: 'thirdPersonSingular', label: 'él / ella / usted' },
  { key: 'firstPersonPlural', label: 'nosotros / nosotras' },
  { key: 'secondPersonPlural', label: 'vosotros / vosotras' },
  { key: 'thirdPersonPlural', label: 'ellos / ellas / ustedes' },
] as const

export type PersonKey = (typeof PERSON_ROWS)[number]['key']

/**
 * User-facing names (Peninsular / classroom Spanish, colloquial where it helps).
 * Internal slugs stay English for URLs and the database.
 */
export const VERB_PARADIGM_LABELS_ES = {
  indicative_present: 'Presente',
  indicative_preterite: 'Pretérito indefinido',
  indicative_present_perfect: 'Pretérito perfecto',
  gerund: 'Gerundio',
  indicative_imperfect: 'Imperfecto',
  imperative_affirmative: 'Imperativo (afirmativo)',
  imperative_negative: 'Imperativo (negativo)',
  indicative_future: 'Futuro',
  indicative_conditional: 'Condicional',
  subjunctive_present: 'Presente de subjuntivo',
  indicative_pluperfect: 'Pluscuamperfecto',
  subjunctive_imperfect_ra: 'Imperfecto de subjuntivo (-ra)',
  subjunctive_imperfect_se: 'Imperfecto de subjuntivo (-se)',
  subjunctive_present_perfect: 'Pretérito perfecto de subjuntivo',
  subjunctive_pluperfect: 'Pluscuamperfecto de subjuntivo',
  indicative_future_perfect: 'Futuro perfecto',
  indicative_conditional_perfect: 'Condicional perfecto',
  subjunctive_future: 'Futuro de subjuntivo',
  indicative_past_anterior: 'Pretérito anterior',
} as const satisfies Record<VerbParadigm, string>

export function formatParadigmTitle(paradigm: string): string {
  const key = paradigm as VerbParadigm
  const label = VERB_PARADIGM_LABELS_ES[key]
  if (label) return label
  return paradigm
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export type VerbFormFields = Record<PersonKey, string> & {
  paradigm: string
}
