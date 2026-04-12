import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'src/graphql/schema.graphql',
  documents: ['src/graphql/documents/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    'src/graphql/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        nonOptionalTypename: true,
        skipTypename: false,
      },
    },
  },
}

export default config
