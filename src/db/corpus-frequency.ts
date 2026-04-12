import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Spanish token counts from **hermitdave/FrequencyWords** (`content/2018/es/es_50k.txt`),
 * derived from **OpenSubtitles** (2018). MIT license — see repository README.
 * @see https://github.com/hermitdave/FrequencyWords
 *
 * Each line: `token count` (last space separates token from integer count).
 */
export function loadSpanishCorpusCounts(): Map<string, number> {
  const dir = path.dirname(fileURLToPath(import.meta.url))
  const filePath = path.join(dir, 'data', 'es_50k.txt')
  const raw = fs.readFileSync(filePath, 'utf8')
  const map = new Map<string, number>()
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t) continue
    const lastSpace = t.lastIndexOf(' ')
    if (lastSpace <= 0) continue
    const word = t.slice(0, lastSpace)
    const n = Number(t.slice(lastSpace + 1).trim())
    if (word && Number.isFinite(n) && n >= 0) map.set(word, n)
  }
  return map
}

/** Sum OpenSubtitles token counts for each surface form (0 if token not in list). */
export function sumCorpusCountsForTokens(
  countsByToken: Map<string, number>,
  tokens: Iterable<string>,
): number {
  let s = 0
  for (const tok of tokens) {
    s += countsByToken.get(tok) ?? 0
  }
  return s
}

/** Normalize positive totals to weights that sum to 1; zeros become `minTotal`. */
export function corpusWeightsFromTotals(totals: readonly number[], minTotal = 1): number[] {
  const raw = totals.map((t) => (t > 0 ? t : minTotal))
  const sum = raw.reduce((a, b) => a + b, 0)
  return raw.map((c) => c / sum)
}
