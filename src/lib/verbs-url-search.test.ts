import { describe, expect, it } from 'vitest'

import { verbParadigmEnum } from '#/db/schema'
import { ALL_PARADIGMS, DEFAULT_VERBS_URL_PARADIGMS } from '#/lib/verb-matrix'
import {
  canonicalizeParadigmsParamString,
  isVerbsUrlSearchRecord,
  paradigmsFromParam,
  paradigmsGraphqlVariable,
  paradigmsParamFromRaw,
  paradigmsToParam,
  VERBS_SEARCH_DEFAULTS,
  validateVerbsUrlSearch,
  verbSearchToMinimalQuery,
} from '#/lib/verbs-url-search'

describe('ALL_PARADIGMS', () => {
  it('lists every verb_paradigm enum member exactly once', () => {
    expect(new Set(ALL_PARADIGMS)).toEqual(new Set(verbParadigmEnum.enumValues))
    expect(ALL_PARADIGMS.length).toBe(verbParadigmEnum.enumValues.length)
  })
})

describe('paradigmsParamFromRaw', () => {
  it('keeps a single comma-separated string as one param value', () => {
    expect(paradigmsParamFromRaw('gerund,indicative_future')).toBe('gerund,indicative_future')
  })

  it('normalizes duplicate query keys (string[]) into one comma string', () => {
    expect(paradigmsParamFromRaw(['gerund', 'indicative_future'])).toBe('gerund,indicative_future')
  })

  it('dedupes and drops unknown slugs when given an array', () => {
    expect(paradigmsParamFromRaw(['gerund', 'gerund', 'not_a_paradigm', 'indicative_future'])).toBe(
      'gerund,indicative_future',
    )
  })

  it('returns undefined for empty / non-string inputs', () => {
    expect(paradigmsParamFromRaw(undefined)).toBeUndefined()
    expect(paradigmsParamFromRaw('')).toBeUndefined()
    expect(paradigmsParamFromRaw('   ')).toBeUndefined()
    expect(paradigmsParamFromRaw([])).toBeUndefined()
    expect(paradigmsParamFromRaw(123)).toBeUndefined()
  })

  it('lowercases hand-edited / bookmark URLs so slugs still resolve', () => {
    expect(paradigmsParamFromRaw('Indicative_present,Gerund')).toBe('indicative_present,gerund')
    expect(paradigmsParamFromRaw(['Indicative_present', 'GERUND'])).toBe(
      'indicative_present,gerund',
    )
  })
})

describe('verbSearchToMinimalQuery', () => {
  it('returns empty object when all fields match defaults', () => {
    expect(verbSearchToMinimalQuery(VERBS_SEARCH_DEFAULTS)).toEqual({})
  })

  it('keeps only non-default fields', () => {
    expect(
      verbSearchToMinimalQuery({
        ...VERBS_SEARCH_DEFAULTS,
        page: 2,
      }),
    ).toEqual({ page: 2 })

    expect(
      verbSearchToMinimalQuery({
        ...VERBS_SEARCH_DEFAULTS,
        ordering: 'MAIN_FORM_ASC',
      }),
    ).toEqual({ ordering: 'MAIN_FORM_ASC' })

    expect(
      verbSearchToMinimalQuery({
        ...VERBS_SEARCH_DEFAULTS,
        search: 'ab',
      }),
    ).toEqual({ search: 'ab' })

    expect(
      verbSearchToMinimalQuery({
        ...VERBS_SEARCH_DEFAULTS,
        paradigms: 'gerund,indicative_future',
      }),
    ).toEqual({ paradigms: 'gerund,indicative_future' })
  })
})

describe('isVerbsUrlSearchRecord', () => {
  it('detects objects shaped like verbs search', () => {
    expect(isVerbsUrlSearchRecord({ search: 'x' })).toBe(true)
    expect(isVerbsUrlSearchRecord({ ordering: 'MAIN_FORM_ASC' })).toBe(true)
    expect(isVerbsUrlSearchRecord({})).toBe(false)
    expect(isVerbsUrlSearchRecord({ search: '', extra: 1 })).toBe(false)
  })
})

describe('canonicalizeParadigmsParamString', () => {
  it('maps Title Case tokens to enum slugs', () => {
    expect(canonicalizeParadigmsParamString('Indicative_present')).toBe('indicative_present')
  })
})

describe('validateVerbsUrlSearch + paradigmsFromParam + GraphQL variable', () => {
  it('preserves a subset when paradigms is a comma-separated string', () => {
    const url = validateVerbsUrlSearch({
      paradigms: 'indicative_present,subjunctive_present',
    })
    const columns = paradigmsFromParam(url.paradigms)
    expect(columns).toEqual(['indicative_present', 'subjunctive_present'])
    expect(paradigmsGraphqlVariable(columns)).toEqual(['indicative_present', 'subjunctive_present'])
  })

  it('preserves a subset when paradigms arrives as string[] (duplicate URL keys)', () => {
    const url = validateVerbsUrlSearch({
      paradigms: ['indicative_present', 'subjunctive_present'],
    })
    expect(url.paradigms).toBe('indicative_present,subjunctive_present')
    const columns = paradigmsFromParam(url.paradigms)
    expect(columns).toEqual(['indicative_present', 'subjunctive_present'])
    expect(paradigmsGraphqlVariable(columns)).toEqual(['indicative_present', 'subjunctive_present'])
  })

  it('does not fall back to all paradigms when the URL uses wrong letter casing', () => {
    const url = validateVerbsUrlSearch({
      paradigms: 'Indicative_present',
    })
    expect(url.paradigms).toBe('indicative_present')
    const columns = paradigmsFromParam(url.paradigms)
    expect(columns).toEqual(['indicative_present'])
    expect(columns.length).not.toBe(ALL_PARADIGMS.length)
  })

  it('does not expand a two-item selection to the full paradigm list', () => {
    const url = validateVerbsUrlSearch({
      paradigms: ['gerund', 'indicative_future'],
    })
    const columns = paradigmsFromParam(url.paradigms)
    expect(columns.length).toBe(2)
    expect(columns).toEqual(['gerund', 'indicative_future'])
    expect(columns.length).not.toBe(ALL_PARADIGMS.length)
  })

  it('defaults omitted paradigms param to the first four paradigms', () => {
    const url = validateVerbsUrlSearch({})
    expect(url.paradigms).toBeUndefined()
    const columns = paradigmsFromParam(url.paradigms)
    expect(columns).toEqual([...DEFAULT_VERBS_URL_PARADIGMS])
    expect(paradigmsGraphqlVariable(columns)).toEqual([...DEFAULT_VERBS_URL_PARADIGMS])
  })

  it('uses null GraphQL variable only when all paradigms are selected', () => {
    const allParam = paradigmsToParam([...ALL_PARADIGMS])
    expect(allParam).toBe([...ALL_PARADIGMS].join(','))
    const columns = paradigmsFromParam(allParam)
    expect(columns.length).toBe(ALL_PARADIGMS.length)
    expect(paradigmsGraphqlVariable(columns)).toBeNull()
  })
})
