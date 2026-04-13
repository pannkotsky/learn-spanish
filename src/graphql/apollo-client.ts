import { HttpLink } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-tanstack-start'

function graphqlHttpUri() {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/graphql`
  }
  const base = process.env.VITE_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000'
  return `${base.replace(/\/$/, '')}/api/graphql`
}

export function makeApolloClient() {
  const isBrowser = typeof window !== 'undefined'

  return new ApolloClient({
    link: new HttpLink({
      uri: graphqlHttpUri(),
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache({
      possibleTypes: {
        Word: ['Verb', 'NonVerbWord'],
      },
    }),
    devtools: {
      enabled: import.meta.env.DEV && isBrowser,
      name: 'Learn Spanish',
    },
  })
}
