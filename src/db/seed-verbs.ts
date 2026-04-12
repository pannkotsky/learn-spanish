/**
 * Syncs `words` from `spanish-verbs.ts` for verb lemmas.
 *
 * **Without `--refresh`:** inserts verbs that are missing from the database only.
 * Existing rows are left as-is (translations and `frequency` are not updated).
 *
 * **With `--refresh`:** updates `translationEn`, `translationUa`, and normalized
 * `frequency` for every seed lemma, and inserts any that are still missing.
 *
 * `frequency` uses OpenSubtitles token counts (`es_50k.txt`): per lemma, sum
 * counts of unique surface forms from the same conjugator used for `verb_forms`,
 * then normalize so seed lemmas sum to 1. Raw per-lemma totals are cached in
 * `verb-seed-corpus-totals.cache.json` (see `verb-seed-corpus-cache.ts`). Pass
 * `--refresh` there too to ignore that cache when recomputing totals.
 *
 * Usage: `pnpm db:seed-verbs` · `pnpm db:seed-verbs -- --refresh`
 *
 * Then run `pnpm db:seed-verb-forms` for new lemmas without `verb_forms` rows.
 */
import { config } from 'dotenv'
import { Conjugator } from '@jirimracek/conjugate-esp'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { corpusWeightsFromTotals, loadSpanishCorpusCounts } from './corpus-frequency'
import { spanishVerbs } from './data/spanish-verbs'
import * as schema from './schema'
import { words } from './schema'
import { argvHasRefresh } from './seed-flags'
import { getCorpusTotalsForSeed } from './verb-seed-corpus-cache'

config({ path: ['.env.local', '.env'] })

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set (.env.local or .env)')
  process.exit(1)
}

const pool = new Pool({ connectionString: url })
const db = drizzle(pool, { schema })

async function main() {
  const refresh = argvHasRefresh()

  const existing = await db
    .select({ id: words.id, mainForm: words.mainForm })
    .from(words)
    .where(eq(words.wordClass, 'verb'))

  const byMainForm = new Map(existing.map((r) => [r.mainForm, r.id]))
  const hasAllSeedVerbs = spanishVerbs.every((v) => byMainForm.has(v.mainForm))

  if (!refresh && hasAllSeedVerbs) {
    console.log(
      'All seed verbs already in the database; nothing to do. ' +
        'Run with `--refresh` to update translations and frequencies.',
    )
    return
  }

  const corpus = loadSpanishCorpusCounts()
  const conjugator = new Conjugator()

  const { totalsByLemma, cacheHits, computed } = getCorpusTotalsForSeed(
    spanishVerbs,
    corpus,
    conjugator,
    refresh ? { refresh: true } : undefined,
  )

  const totalsArray = spanishVerbs.map((v) => totalsByLemma.get(v.mainForm) ?? 0)
  const weights = corpusWeightsFromTotals(totalsArray)

  let inserted = 0
  let updated = 0
  let unchanged = 0

  for (let i = 0; i < spanishVerbs.length; i++) {
    const v = spanishVerbs[i]!
    const frequency = weights[i]!
    const id = byMainForm.get(v.mainForm)

    if (id !== undefined) {
      if (refresh) {
        await db
          .update(words)
          .set({
            translationEn: v.translationEn,
            translationUa: v.translationUa,
            frequency,
            updatedAt: new Date(),
          })
          .where(and(eq(words.id, id), eq(words.wordClass, 'verb')))
        updated++
      } else {
        unchanged++
      }
    } else {
      await db.insert(words).values({
        mainForm: v.mainForm,
        wordClass: 'verb',
        translationEn: v.translationEn,
        translationUa: v.translationUa,
        frequency,
      })
      inserted++
    }
  }

  const refreshNote = refresh ? ' (--refresh: corpus cache ignored)' : ''
  const countsNote = refresh
    ? `${inserted} inserted, ${updated} updated.`
    : `${inserted} inserted, ${unchanged} already present (left unchanged).`
  console.log(
    `Verb seed done: ${spanishVerbs.length} lemmas (${countsNote}) ` +
      `Corpus totals: ${cacheHits} from cache, ${computed} computed.${refreshNote}`,
  )
  if (inserted > 0) {
    console.log('Run `pnpm db:seed-verb-forms` to add conjugation rows for new verbs.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    void pool.end()
  })
