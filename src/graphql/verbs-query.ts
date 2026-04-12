import { and, asc, count, desc, eq, ilike, sql } from 'drizzle-orm'

import { words } from '#/db/schema'

export type WordsOrderingGql = 'FREQUENCY_DESC' | 'MAIN_FORM_ASC' | 'RANDOM'

export type VerbsPageParent = {
  search: string | undefined
}

/** Strip wildcards / length-limit so value is safe inside `ILIKE 'value%'`. */
export function sanitizeSearch(input: string | null | undefined): string | undefined {
  if (input == null) return undefined
  const trimmed = input.trim().slice(0, 64)
  if (!trimmed) return undefined
  const noWildcards = trimmed.replace(/[%_\\]/g, '')
  return noWildcards.length > 0 ? noWildcards : undefined
}

function wordsWhereForSearch(search: string | undefined) {
  return search ? ilike(words.mainForm, `${search}%`) : undefined
}

/** Verb lemmas only, optional main-form prefix search. */
export function verbsListWhere(search: string | undefined) {
  const verbOnly = eq(words.wordClass, 'verb')
  const searchCond = wordsWhereForSearch(search)
  return searchCond ? and(verbOnly, searchCond) : verbOnly
}

export function wordsOrderByClauses(ordering: WordsOrderingGql) {
  switch (ordering) {
    case 'MAIN_FORM_ASC':
      return [asc(words.mainForm), asc(words.id)]
    case 'RANDOM':
      return [sql`random()`]
    case 'FREQUENCY_DESC':
    default:
      return [desc(words.frequency), asc(words.id)]
  }
}

export const wordsCountSelection = { total: count() }
