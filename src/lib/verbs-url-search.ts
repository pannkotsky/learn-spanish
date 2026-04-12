import type { VerbParadigm, WordsOrdering } from '#/graphql/__generated__/graphql'
import { ALL_PARADIGMS, DEFAULT_VERBS_URL_PARADIGMS } from '#/lib/verb-matrix'

const ORDERINGS: readonly WordsOrdering[] = ['FREQUENCY_DESC', 'MAIN_FORM_ASC']

const paradigmSet = new Set<string>(ALL_PARADIGMS)

/** Map URL / hand-edited slugs to canonical DB enum strings (all lowercase). */
function canonicalParadigmToken(raw: string): string | null {
  const key = raw.trim().toLowerCase()
  if (!key || !paradigmSet.has(key)) return null
  return key
}

/** Comma-separated param → canonical lowercase slugs only (invalid tokens dropped). */
export function canonicalizeParadigmsParamString(param: string): string | undefined {
  const seen = new Set<string>()
  const out: string[] = []
  for (const part of param.split(',')) {
    const key = canonicalParadigmToken(part)
    if (key == null || seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out.length > 0 ? out.join(',') : undefined
}

/**
 * TanStack Router's query decoder turns repeated keys (`?p=a&p=b`) into a
 * string array. `validateSearch` must accept that shape or we drop the param
 * and fall back to the default paradigm subset (see `paradigmsFromParam`).
 */
export function paradigmsParamFromRaw(raw: unknown): string | undefined {
  if (raw == null) return undefined
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t.length === 0) return undefined
    const canonical = canonicalizeParadigmsParamString(t)
    return canonical && canonical.length > 0 ? canonical.slice(0, 2000) : undefined
  }
  if (Array.isArray(raw)) {
    const seen = new Set<string>()
    const out: string[] = []
    for (const item of raw) {
      if (typeof item !== 'string') continue
      const key = canonicalParadigmToken(item)
      if (key == null || seen.has(key)) continue
      seen.add(key)
      out.push(key)
    }
    return out.length > 0 ? out.join(',').slice(0, 2000) : undefined
  }
  return undefined
}

export type VerbsUrlSearch = {
  /** Lemma prefix filter (URL key: `search`). */
  search: string
  ordering: WordsOrdering
  /** 0-based page index. */
  page: number
  /**
   * Comma-separated `VerbParadigm` values; omitted from URL when the default subset is selected.
   */
  paradigms?: string
}

export function validateVerbsUrlSearch(raw: Record<string, unknown>): VerbsUrlSearch {
  const search = typeof raw.search === 'string' ? raw.search.slice(0, 200) : ''

  const ordering: WordsOrdering =
    typeof raw.ordering === 'string'
      ? (ORDERINGS.find((o) => o === raw.ordering) ?? 'FREQUENCY_DESC')
      : 'FREQUENCY_DESC'

  const pageRaw = raw.page
  let page = 0
  if (typeof pageRaw === 'number' && Number.isFinite(pageRaw)) {
    page = Math.max(0, Math.floor(pageRaw))
  } else if (typeof pageRaw === 'string' && pageRaw.length > 0) {
    const n = parseInt(pageRaw, 10)
    if (Number.isFinite(n)) page = Math.max(0, n)
  }

  const paradigms = paradigmsParamFromRaw(raw.paradigms)

  return { search, ordering, page, paradigms }
}

/** Canonical defaults for `/verbs` (empty search, frequency order, page 0, default paradigm subset). */
export const VERBS_SEARCH_DEFAULTS: VerbsUrlSearch = validateVerbsUrlSearch({})

/** Default `/verbs` search object (full shape); prefer `verbSearchToMinimalQuery` for links. */
export const verbsRouteDefaultSearch = VERBS_SEARCH_DEFAULTS

/** Query keys only used by the verbs route (for router `stringifySearch` detection). */
export const VERBS_URL_SEARCH_KEYS = ['search', 'ordering', 'page', 'paradigms'] as const

const verbsSearchKeySet = new Set<string>(VERBS_URL_SEARCH_KEYS)

export function isVerbsUrlSearchRecord(raw: Record<string, unknown>): boolean {
  const keys = Object.keys(raw)
  return keys.length > 0 && keys.every((k) => verbsSearchKeySet.has(k))
}

/** Strip values equal to defaults so they can be omitted from the URL (`undefined` = not serialized). */
export function verbSearchToMinimalQuery(s: VerbsUrlSearch): Partial<VerbsUrlSearch> {
  const d = VERBS_SEARCH_DEFAULTS
  const out: Partial<VerbsUrlSearch> = {}
  if (s.search !== d.search) out.search = s.search
  if (s.ordering !== d.ordering) out.ordering = s.ordering
  if (s.page !== d.page) out.page = s.page
  if (s.paradigms !== d.paradigms) out.paradigms = s.paradigms
  return out
}

function isDefaultParadigmSelection(orderedSelection: readonly string[]): boolean {
  if (orderedSelection.length !== DEFAULT_VERBS_URL_PARADIGMS.length) return false
  return DEFAULT_VERBS_URL_PARADIGMS.every((p, i) => orderedSelection[i] === p)
}

/** Ordered list of selected paradigms (defaults to first four in `ALL_PARADIGMS` order). */
export function paradigmsFromParam(paradigmsParam: string | undefined): string[] {
  if (paradigmsParam == null || paradigmsParam.trim() === '') {
    return [...DEFAULT_VERBS_URL_PARADIGMS]
  }
  const canonical = canonicalizeParadigmsParamString(paradigmsParam)
  if (canonical == null) return [...DEFAULT_VERBS_URL_PARADIGMS]
  return canonical.split(',')
}

/**
 * Value for `Verb.forms(paradigms: …)` via the verbs page query variable.
 * `null` omits the argument so the server returns all paradigms; a non-empty
 * array restricts columns. An empty array would yield no forms on the server;
 * this route always keeps at least one paradigm selected, so we never send `[]`.
 */
export function paradigmsGraphqlVariable(
  orderedSelection: readonly string[],
): VerbParadigm[] | null {
  if (orderedSelection.length === ALL_PARADIGMS.length) return null
  return [...orderedSelection] as VerbParadigm[]
}

/** Canonical comma string for URL; `undefined` when selection matches the default subset. */
export function paradigmsToParam(orderedSelection: readonly string[]): string | undefined {
  if (isDefaultParadigmSelection(orderedSelection)) return undefined
  return orderedSelection.join(',')
}

/** Checkbox set + column order from URL. */
export function orderedParadigmsFromSelection(selected: ReadonlySet<string>): string[] {
  return ALL_PARADIGMS.filter((p) => selected.has(p))
}
