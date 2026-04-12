import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

import type { GqlContext } from '#/graphql/context'
import { resolvers } from '#/graphql/resolvers'
import { typeDefs } from '#/graphql/type-defs'

const apolloServer = new ApolloServer<GqlContext>({
  typeDefs,
  resolvers,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
})

let startPromise: Promise<void> | null = null

export function ensureApolloServerStarted() {
  if (!startPromise) {
    startPromise = apolloServer.start().then(() => undefined)
  }
  return startPromise
}

export { apolloServer }
