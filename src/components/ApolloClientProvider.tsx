import { ApolloProvider } from '@apollo/client/react'
import { type ReactNode, useState } from 'react'

import { makeApolloClient } from '#/graphql/apollo-client'

export function ApolloClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => makeApolloClient())
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
