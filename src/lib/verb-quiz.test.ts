import { describe, expect, it } from 'vitest'

import { PERSON_ROWS } from '#/lib/verb-matrix'

import {
  normalizeVerbAnswer,
  pickVerbQuizQuestionFromFetchedVerb,
  verbAnswersMatch,
  type VerbQuizVerb,
} from './verb-quiz'

describe('normalizeVerbAnswer + verbAnswersMatch', () => {
  it('compares case- and whitespace-insensitively', () => {
    expect(normalizeVerbAnswer('  Hablo  ')).toBe('hablo')
    expect(verbAnswersMatch('Hablo', 'hablo')).toBe(true)
    expect(verbAnswersMatch('hablo', 'hablé')).toBe(false)
  })
})

describe('pickVerbQuizQuestionFromFetchedVerb', () => {
  const cells = Object.fromEntries(
    PERSON_ROWS.map((row) => [row.key, `indicative_present-${row.key}`]),
  ) as Record<(typeof PERSON_ROWS)[number]['key'], string>

  const verb: VerbQuizVerb = {
    id: '1',
    mainForm: 'hablar',
    translationEn: 'to speak',
    forms: [{ paradigm: 'indicative_present', ...cells }],
  }

  it('returns a question with a non-empty cell', () => {
    for (let i = 0; i < 20; i++) {
      const q = pickVerbQuizQuestionFromFetchedVerb(verb)
      expect(q).not.toBeNull()
      expect(q!.verb.mainForm).toBe('hablar')
      expect(q!.correctAnswer.length).toBeGreaterThan(0)
      expect(q!.paradigm).toBe('indicative_present')
    }
  })
})
