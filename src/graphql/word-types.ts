import type { InferSelectModel } from 'drizzle-orm'

import { verbForms, words } from '#/db/schema'

export type WordRow = InferSelectModel<typeof words>
export type VerbFormRow = InferSelectModel<typeof verbForms>

export type GraphqlVerbForm = Omit<VerbFormRow, 'wordId'>

export function stripWordId(row: VerbFormRow): GraphqlVerbForm {
  const { wordId: _wordId, ...rest } = row
  return rest
}

export function mapWordToGraphql(word: WordRow) {
  return {
    ...word,
    id: String(word.id),
    createdAt: isoMaybe(word.createdAt),
    updatedAt: isoMaybe(word.updatedAt),
  }
}

function isoMaybe(value: Date | null | undefined): string | null {
  if (value == null) return null
  return value instanceof Date ? value.toISOString() : String(value)
}
