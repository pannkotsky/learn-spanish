import { ApolloLink, HttpLink } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-tanstack-start'

const graphqlPath = '/api/graphql'

function graphqlHttpUri() {
  if (typeof window !== 'undefined') {
    return graphqlPath
  }
  const base = process.env.VITE_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000'
  return `${base.replace(/\/$/, '')}${graphqlPath}`
}

export function makeApolloClient() {
  const isBrowser = typeof window !== 'undefined'

  const graphqlApiUrl = graphqlHttpUri()

  const httpLink = new HttpLink({
    uri: graphqlApiUrl,
    credentials: 'same-origin',
  })

  // Override uri to include the graphql operation name (helps with identifying queries in network tab and datadog)
  const operationNameLink = new SetContextLink(({ headers }, operation) => {
    return {
      uri: `${graphqlApiUrl}?o=${operation.operationName}`,
      headers: {
        ...headers,
        'X-Apollo-Operation-Name': operation.operationName,
      },
    }
  })

  return new ApolloClient({
    link: ApolloLink.from([operationNameLink, httpLink]),
    cache: new InMemoryCache({
      possibleTypes: {
        Word: ['Verb', 'NonVerbWord'],
      },
      typePolicies: {
        Query: {
          fields: {
            verbs: {
              keyArgs: ['search'],
              merge(existing, incoming, { mergeObjects }) {
                if (!incoming) return existing
                if (!existing) return incoming
                return mergeObjects(existing, incoming)
              },
            },
          },
        },
        VerbsPage: {
          keyFields: false,
          fields: {
            results: {
              keyArgs: ['ordering', 'limit', 'offset'],
            },
          },
        },
      },
    }),
    devtools: {
      enabled: import.meta.env.DEV && isBrowser,
      name: 'Learn Spanish',
    },
  })
}
