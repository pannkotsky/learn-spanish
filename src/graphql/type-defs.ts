import gql from 'graphql-tag'

import schemaSDL from '#/graphql/schema.graphql?raw'

export const typeDefs = gql(schemaSDL)
