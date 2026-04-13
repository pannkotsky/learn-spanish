import { eq } from 'drizzle-orm'

import { type VerbParadigm, words } from '#/db/schema'
import type { GqlContext } from '#/graphql/context'
import {
  sanitizeSearch,
  type VerbsPageParent,
  verbsListWhere,
  type WordsOrderingGql,
  wordsCountSelection,
  wordsOrderByClauses,
} from '#/graphql/verbs-query'
import { mapWordToGraphql } from '#/graphql/word-types'
import { ALL_PARADIGMS } from '#/lib/verb-matrix'

function isoMaybe(value: Date | null | undefined): string | null {
  if (value == null) return null
  return value instanceof Date ? value.toISOString() : String(value)
}

const paradigmDisplayOrder = new Map<string, number>(ALL_PARADIGMS.map((p, index) => [p, index]))

function sortVerbFormsByParadigmOrder<T extends { paradigm: string }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) =>
      (paradigmDisplayOrder.get(a.paradigm) ?? 999) - (paradigmDisplayOrder.get(b.paradigm) ?? 999),
  )
}

export const resolvers = {
  Query: {
    verbs: (_: unknown, args: { search?: string | null }): VerbsPageParent => ({
      search: sanitizeSearch(args.search),
    }),
    word: async (_: unknown, args: { id: string }, ctx: GqlContext) => {
      const n = Number(args.id)
      if (!Number.isFinite(n)) return null
      const [row] = await ctx.db.select().from(words).where(eq(words.id, n)).limit(1)
      return row ? mapWordToGraphql(row) : null
    },
  },
  VerbsPage: {
    totalCount: async (parent: VerbsPageParent, _: unknown, ctx: GqlContext) => {
      const whereClause = verbsListWhere(parent.search)
      const [row] = await ctx.db.select(wordsCountSelection).from(words).where(whereClause)
      return Number(row?.total ?? 0)
    },
    results: async (
      parent: VerbsPageParent,
      args: {
        ordering?: WordsOrderingGql | null
        limit?: number | null
        offset?: number | null
      },
      ctx: GqlContext,
    ) => {
      const limit = Math.min(Math.max(args.limit ?? 25, 1), 500)
      const offset = Math.max(args.offset ?? 0, 0)
      const whereClause = verbsListWhere(parent.search)
      const orderBy = wordsOrderByClauses(args.ordering ?? 'FREQUENCY_DESC')
      const rows = await ctx.db
        .select()
        .from(words)
        .where(whereClause)
        .orderBy(...orderBy)
        .limit(limit)
        .offset(offset)
      return rows.map(mapWordToGraphql)
    },
  },
  Word: {
    __resolveType(word: { wordClass: string }) {
      return word.wordClass === 'verb' ? 'Verb' : 'NonVerbWord'
    },
  },
  Verb: {
    forms: async (
      parent: { id: string },
      args: { paradigms?: VerbParadigm[] | null },
      ctx: GqlContext,
    ) => {
      const rows = await ctx.loaders.verbFormsByWordId.load(Number(parent.id))
      const list = args.paradigms
      if (list == null) return sortVerbFormsByParadigmOrder(rows)
      if (list.length === 0) return []
      const byParadigm = new Map(rows.map((r) => [r.paradigm, r]))
      return list
        .map((p) => byParadigm.get(p))
        .filter((row): row is (typeof rows)[number] => row != null)
    },
  },
  VerbForm: {
    id: (parent: { id: number }) => String(parent.id),
    createdAt: (parent: { createdAt: Date | null | undefined }) => isoMaybe(parent.createdAt),
    updatedAt: (parent: { updatedAt: Date | null | undefined }) => isoMaybe(parent.updatedAt),
  },
}
