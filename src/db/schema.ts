import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export * from './auth-schema'

/** PostgreSQL enum `word_class` — parts of speech for vocabulary entries. */
export const wordClassEnum = pgEnum('word_class', [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'article',
  'determiner',
  'numeral',
  'interjection',
  'auxiliary',
  'particle',
  'other',
])

export type WordClass = (typeof wordClassEnum.enumValues)[number]

/** PostgreSQL enum `verb_paradigm` — mood/tense/non-finite slot for conjugation rows. */
export const verbParadigmEnum = pgEnum('verb_paradigm', [
  'indicative_present',
  'indicative_preterite',
  'indicative_imperfect',
  'indicative_future',
  'indicative_conditional',
  'indicative_present_perfect',
  'indicative_pluperfect',
  'indicative_future_perfect',
  'indicative_conditional_perfect',
  'indicative_past_anterior',
  'subjunctive_present',
  'subjunctive_imperfect_ra',
  'subjunctive_imperfect_se',
  'subjunctive_future',
  'subjunctive_present_perfect',
  'subjunctive_pluperfect',
  'imperative_affirmative',
  'imperative_negative',
  'gerund',
])

export type VerbParadigm = (typeof verbParadigmEnum.enumValues)[number]

export const words = pgTable('words', {
  id: serial().primaryKey(),
  mainForm: text().notNull(),
  wordClass: wordClassEnum('word_class').notNull(),
  /**
   * Corpus-derived relative weight in [0, 1]: sum of OpenSubtitles `es_50k`
   * counts for each unique surface form from our conjugation tables, divided
   * by the sum of those totals across all seeded verbs. Sum over rows ≈ 1.
   */
  frequency: doublePrecision('frequency').notNull(),
  translationEn: text().notNull(),
  translationUa: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

/**
 * Conjugation paradigm for a verb lemma (`words.id`). Person columns are always
 * `NOT NULL`; for the non-finite **gerund** paradigm, store the same surface
 * form in all six cells.
 */
export const verbForms = pgTable(
  'verb_forms',
  {
    id: serial('id').primaryKey(),
    wordId: integer('word_id')
      .notNull()
      .references(() => words.id, { onDelete: 'cascade' }),
    paradigm: verbParadigmEnum('paradigm').notNull(),
    firstPersonSingular: text('first_person_singular').notNull(),
    firstPersonPlural: text('first_person_plural').notNull(),
    secondPersonSingular: text('second_person_singular').notNull(),
    secondPersonPlural: text('second_person_plural').notNull(),
    thirdPersonSingular: text('third_person_singular').notNull(),
    thirdPersonPlural: text('third_person_plural').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (t) => [unique('verb_forms_word_id_paradigm_unique').on(t.wordId, t.paradigm)],
)
