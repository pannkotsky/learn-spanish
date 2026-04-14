import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type NonVerbWord = Word & {
  __typename: 'NonVerbWord'
  createdAt?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  mainForm: Scalars['String']['output']
  translationEn: Scalars['String']['output']
  translationUa: Scalars['String']['output']
  updatedAt?: Maybe<Scalars['String']['output']>
  wordClass: WordClass
}

export type Query = {
  __typename: 'Query'
  verbs: VerbsPage
  word?: Maybe<Word>
}

export type QueryVerbsArgs = {
  search?: InputMaybe<Scalars['String']['input']>
}

export type QueryWordArgs = {
  id: Scalars['ID']['input']
}

export type Verb = Word & {
  __typename: 'Verb'
  createdAt?: Maybe<Scalars['String']['output']>
  /**
   * When `paradigms` is omitted or null, all paradigms are returned.
   * When `paradigms` is an empty list, no forms are returned.
   */
  forms: Array<VerbForm>
  id: Scalars['ID']['output']
  mainForm: Scalars['String']['output']
  translationEn: Scalars['String']['output']
  translationUa: Scalars['String']['output']
  updatedAt?: Maybe<Scalars['String']['output']>
  wordClass: WordClass
}

export type VerbFormsArgs = {
  paradigms?: InputMaybe<Array<VerbParadigm>>
}

export type VerbForm = {
  __typename: 'VerbForm'
  createdAt?: Maybe<Scalars['String']['output']>
  firstPersonPlural: Scalars['String']['output']
  firstPersonSingular: Scalars['String']['output']
  id: Scalars['ID']['output']
  paradigm: VerbParadigm
  secondPersonPlural: Scalars['String']['output']
  secondPersonSingular: Scalars['String']['output']
  thirdPersonPlural: Scalars['String']['output']
  thirdPersonSingular: Scalars['String']['output']
  updatedAt?: Maybe<Scalars['String']['output']>
}

export type VerbParadigm =
  | 'gerund'
  | 'imperative_affirmative'
  | 'imperative_negative'
  | 'indicative_conditional'
  | 'indicative_conditional_perfect'
  | 'indicative_future'
  | 'indicative_future_perfect'
  | 'indicative_imperfect'
  | 'indicative_past_anterior'
  | 'indicative_pluperfect'
  | 'indicative_present'
  | 'indicative_present_perfect'
  | 'indicative_preterite'
  | 'subjunctive_future'
  | 'subjunctive_imperfect_ra'
  | 'subjunctive_imperfect_se'
  | 'subjunctive_pluperfect'
  | 'subjunctive_present'
  | 'subjunctive_present_perfect'

export type VerbsPage = {
  __typename: 'VerbsPage'
  results: Array<Verb>
  totalCount: Scalars['Int']['output']
}

export type VerbsPageResultsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  ordering?: InputMaybe<WordsOrdering>
}

export type Word = {
  createdAt?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  mainForm: Scalars['String']['output']
  translationEn: Scalars['String']['output']
  translationUa: Scalars['String']['output']
  updatedAt?: Maybe<Scalars['String']['output']>
  wordClass: WordClass
}

export type WordClass =
  | 'adjective'
  | 'adverb'
  | 'article'
  | 'auxiliary'
  | 'conjunction'
  | 'determiner'
  | 'interjection'
  | 'noun'
  | 'numeral'
  | 'other'
  | 'particle'
  | 'preposition'
  | 'pronoun'
  | 'verb'

export type WordsOrdering =
  | 'FREQUENCY_DESC'
  | 'MAIN_FORM_ASC'
  /** Uniform random row order (use with small `limit`, e.g. quiz). */
  | 'RANDOM'

export type VerbQuizRandomVerbQueryVariables = Exact<{
  paradigm: VerbParadigm
}>

export type VerbQuizRandomVerbQuery = {
  __typename: 'Query'
  verbs: {
    __typename: 'VerbsPage'
    totalCount: number
    results: Array<{
      __typename: 'Verb'
      id: string
      mainForm: string
      translationEn: string
      forms: Array<{
        __typename: 'VerbForm'
        paradigm: VerbParadigm
        firstPersonSingular: string
        firstPersonPlural: string
        secondPersonSingular: string
        secondPersonPlural: string
        thirdPersonSingular: string
        thirdPersonPlural: string
      }>
    }>
  }
}

export type VerbsPageQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>
  offset: Scalars['Int']['input']
  ordering: WordsOrdering
  paradigms?: InputMaybe<Array<VerbParadigm> | VerbParadigm>
}>

export type VerbsPageQuery = {
  __typename: 'Query'
  verbs: {
    __typename: 'VerbsPage'
    totalCount: number
    results: Array<{
      __typename: 'Verb'
      id: string
      mainForm: string
      translationEn: string
      forms: Array<{
        __typename: 'VerbForm'
        paradigm: VerbParadigm
        firstPersonSingular: string
        firstPersonPlural: string
        secondPersonSingular: string
        secondPersonPlural: string
        thirdPersonSingular: string
        thirdPersonPlural: string
      }>
    }>
  }
}

export const VerbQuizRandomVerbDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'VerbQuizRandomVerb' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'paradigm' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'VerbParadigm' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'verbs' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'search' },
                value: { kind: 'NullValue' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'results' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'ordering' },
                      value: { kind: 'EnumValue', value: 'RANDOM' },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: { kind: 'IntValue', value: '1' },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'offset' },
                      value: { kind: 'IntValue', value: '0' },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'mainForm' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'translationEn' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'forms' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'paradigms' },
                            value: {
                              kind: 'ListValue',
                              values: [
                                { kind: 'Variable', name: { kind: 'Name', value: 'paradigm' } },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'paradigm' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstPersonSingular' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstPersonPlural' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'secondPersonSingular' },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'secondPersonPlural' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'thirdPersonSingular' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'thirdPersonPlural' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<VerbQuizRandomVerbQuery, VerbQuizRandomVerbQueryVariables>
export const VerbsPageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'VerbsPage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'ordering' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'WordsOrdering' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'paradigms' } },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: { kind: 'NamedType', name: { kind: 'Name', value: 'VerbParadigm' } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'verbs' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'search' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'search' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'results' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'ordering' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'ordering' } },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: { kind: 'IntValue', value: '25' },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'offset' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'offset' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'mainForm' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'translationEn' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'forms' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'paradigms' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'paradigms' } },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'paradigm' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstPersonSingular' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstPersonPlural' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'secondPersonSingular' },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'secondPersonPlural' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'thirdPersonSingular' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'thirdPersonPlural' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<VerbsPageQuery, VerbsPageQueryVariables>
