/**
 * Ensures `verb_forms` has a row for every paradigm in `VERB_PARADIGMS` for each
 * verb in `words`, using `@jirimracek/conjugate-esp` (European Spanish /
 * castellano, vosotros forms).
 *
 * Usage: `pnpm db:seed-verb-forms` · `pnpm db:seed-verb-forms -- --refresh` — deletes all
 * `verb_forms` rows for current verbs, then inserts full paradigms again.
 * Without `--refresh`, only missing `(word_id, paradigm)` rows are inserted.
 */
import { config } from 'dotenv'
import { Conjugator } from '@jirimracek/conjugate-esp'
import { eq, inArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema'
import { verbForms, words } from './schema'
import { argvHasRefresh } from './seed-flags'
import { cellsForParadigm, VERB_PARADIGMS } from './verb-conjugation-cells'

config({ path: ['.env.local', '.env'] })

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set (.env.local or .env)')
  process.exit(1)
}

const pool = new Pool({ connectionString: url })
const db = drizzle(pool, { schema })
const conjugator = new Conjugator()

function slotKey(wordId: number, paradigm: (typeof VERB_PARADIGMS)[number]): string {
  return `${wordId}\0${paradigm}`
}

async function main() {
  const refresh = argvHasRefresh()

  const verbRows = await db
    .select({ id: words.id, mainForm: words.mainForm })
    .from(words)
    .where(eq(words.wordClass, 'verb'))

  if (verbRows.length === 0) {
    console.log('No verbs in `words`; nothing to seed.')
    return
  }

  const verbIds = verbRows.map((r) => r.id)
  if (refresh) {
    await db.delete(verbForms).where(inArray(verbForms.wordId, verbIds))
  }

  const existingSlots = refresh
    ? []
    : await db.select({ wordId: verbForms.wordId, paradigm: verbForms.paradigm }).from(verbForms)

  const present = new Set(existingSlots.map((r) => slotKey(r.wordId, r.paradigm)))

  const insertRows: (typeof verbForms.$inferInsert)[] = []
  const failures: { lemma: string; reason: string }[] = []
  let skippedParadigms = 0

  for (const { id: wordId, mainForm } of verbRows) {
    const raw = conjugator.conjugateSync(mainForm, 'castellano')
    if (typeof raw === 'string') {
      failures.push({ lemma: mainForm, reason: raw })
      continue
    }
    const table = raw[0].conjugation

    for (const paradigm of VERB_PARADIGMS) {
      if (present.has(slotKey(wordId, paradigm))) {
        skippedParadigms++
        continue
      }
      const cells = cellsForParadigm(paradigm, table)
      insertRows.push({
        wordId,
        paradigm,
        ...cells,
      })
    }
  }

  const CHUNK = 400
  for (let i = 0; i < insertRows.length; i += CHUNK) {
    const chunk = insertRows.slice(i, i + CHUNK)
    await db.insert(verbForms).values(chunk)
  }

  const refreshNote = refresh ? ' (--refresh: cleared forms for current verbs)' : ''
  console.log(
    `verb_forms: inserted ${insertRows.length} row(s); ${skippedParadigms} paradigm slot(s) skipped as already present. ` +
      `Processed ${verbRows.length - failures.length} verb(s).${refreshNote}`,
  )
  if (failures.length) {
    console.warn('Skipped verbs (conjugator error):')
    for (const f of failures) console.warn(`  ${f.lemma}: ${f.reason}`)
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
