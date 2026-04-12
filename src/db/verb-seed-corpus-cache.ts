/**
 * Persists raw OpenSubtitles corpus totals per lemma (sum of `es_50k` counts over
 * conjugated surface forms) so `pnpm db:seed-verbs` skips conjugation + corpus walks
 * for lemmas already in the cache when the corpus file and surface-extraction
 * version are unchanged.
 *
 * Cache file: `verb-seed-corpus-totals.cache.json` next to this module (gitignored).
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Conjugator } from '@jirimracek/conjugate-esp'

import { sumCorpusCountsForTokens } from './corpus-frequency'
import type { SpanishVerbSeed } from './data/spanish-verbs'
import { surfaceFormsForLemma } from './verb-conjugation-cells'

/** Bump when `surfaceFormsForLemma` / paradigms change so totals are recomputed. */
export const VERB_SEED_CORPUS_TOTALS_SURFACES_VERSION = '2'

type CacheFile = {
  corpusSha256: string
  surfacesVersion: string
  totals: Record<string, number>
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_PATH = path.join(__dirname, 'verb-seed-corpus-totals.cache.json')
const CORPUS_PATH = path.join(__dirname, 'data', 'es_50k.txt')

function sha256File(filePath: string): string {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

function readCache(): CacheFile | null {
  try {
    const raw = fs.readFileSync(CACHE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as CacheFile
    if (
      typeof parsed.corpusSha256 === 'string' &&
      typeof parsed.surfacesVersion === 'string' &&
      parsed.totals &&
      typeof parsed.totals === 'object'
    ) {
      return parsed
    }
  } catch {
    /* missing or invalid */
  }
  return null
}

function writeCache(data: CacheFile): void {
  const tmp = `${CACHE_PATH}.${process.pid}.tmp`
  fs.writeFileSync(tmp, `${JSON.stringify(data, null, 0)}\n`, 'utf8')
  fs.renameSync(tmp, CACHE_PATH)
}

export type CorpusTotalsResult = {
  totalsByLemma: Map<string, number>
  cacheHits: number
  computed: number
}

export type GetCorpusTotalsForSeedOptions = {
  /**
   * When true, ignore the disk cache and recompute every lemma; the cache file
   * is still rewritten with fresh totals.
   */
  refresh?: boolean
}

/**
 * Returns corpus totals for every lemma in `seed`. Uses disk cache when
 * `es_50k.txt` hash and `surfacesVersion` match; otherwise recomputes all totals.
 */
export function getCorpusTotalsForSeed(
  seed: readonly SpanishVerbSeed[],
  corpus: Map<string, number>,
  conjugator: Conjugator,
  options?: GetCorpusTotalsForSeedOptions,
): CorpusTotalsResult {
  const corpusSha256 = sha256File(CORPUS_PATH)
  const prev = readCache()
  const cacheOk =
    !options?.refresh &&
    prev &&
    prev.corpusSha256 === corpusSha256 &&
    prev.surfacesVersion === VERB_SEED_CORPUS_TOTALS_SURFACES_VERSION

  const totalsByLemma = new Map<string, number>()
  let cacheHits = 0
  let computed = 0

  for (const { mainForm } of seed) {
    const cached = cacheOk ? prev!.totals[mainForm] : undefined
    if (cached !== undefined && Number.isFinite(cached)) {
      totalsByLemma.set(mainForm, cached)
      cacheHits++
      continue
    }
    const r = surfaceFormsForLemma(mainForm, conjugator)
    const total = r.ok ? sumCorpusCountsForTokens(corpus, r.forms) : 0
    if (!r.ok) {
      console.warn(`Conjugation failed for "${mainForm}" (${r.error}); corpus total 0.`)
    }
    totalsByLemma.set(mainForm, total)
    computed++
  }

  const totals: Record<string, number> = {}
  for (const { mainForm } of seed) {
    totals[mainForm] = totalsByLemma.get(mainForm) ?? 0
  }
  writeCache({
    corpusSha256,
    surfacesVersion: VERB_SEED_CORPUS_TOTALS_SURFACES_VERSION,
    totals,
  })

  return { totalsByLemma, cacheHits, computed }
}
