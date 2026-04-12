import DataLoader from 'dataloader'
import { inArray } from 'drizzle-orm'

import { db } from '#/db'
import { verbForms } from '#/db/schema'

import type { VerbFormRow } from '#/graphql/word-types'
import { stripWordId } from '#/graphql/word-types'

export function createVerbFormsLoader(database: typeof db) {
  return new DataLoader<number, ReturnType<typeof stripWordId>[]>(async (wordIds) => {
    const ids = [...wordIds]
    if (ids.length === 0) return []

    const rows = await database.select().from(verbForms).where(inArray(verbForms.wordId, ids))

    const byWord = new Map<number, VerbFormRow[]>()
    for (const id of ids) {
      byWord.set(id, [])
    }
    for (const row of rows) {
      byWord.get(row.wordId)?.push(row)
    }

    return ids.map((id) => (byWord.get(id) ?? []).map(stripWordId))
  })
}

export function createLoaders(database: typeof db) {
  return {
    verbFormsByWordId: createVerbFormsLoader(database),
  }
}
