import { describe, expect, it } from 'vitest'

import { wordsOrderByClauses } from './verbs-query'

describe('wordsOrderByClauses', () => {
  it('returns a single order clause for RANDOM ordering', () => {
    const clauses = wordsOrderByClauses('RANDOM')
    expect(clauses).toHaveLength(1)
    expect(clauses[0]).toBeDefined()
  })
})
