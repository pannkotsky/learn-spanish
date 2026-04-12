import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

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
    ssrMode: !isBrowser,
    devtools: {
      enabled: import.meta.env.DEV && isBrowser,
      name: 'Learn Spanish',
    },
  })
}
