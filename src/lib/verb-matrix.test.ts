import { describe, expect, it } from 'vitest'

import { verbParadigmEnum } from '#/db/schema'

import { ALL_PARADIGMS, formatParadigmTitle, VERB_PARADIGM_LABELS_ES } from './verb-matrix'

describe('VERB_PARADIGM_LABELS_ES', () => {
  it('covers every schema paradigm exactly once', () => {
    const keys = new Set(Object.keys(VERB_PARADIGM_LABELS_ES))
    expect(keys).toEqual(new Set(verbParadigmEnum.enumValues))
    expect(keys.size).toBe(verbParadigmEnum.enumValues.length)
  })

  it('matches ALL_PARADIGMS order entries', () => {
    for (const p of ALL_PARADIGMS) {
      expect(VERB_PARADIGM_LABELS_ES[p]).toBeDefined()
      expect(formatParadigmTitle(p)).toBe(VERB_PARADIGM_LABELS_ES[p])
    }
  })
})
