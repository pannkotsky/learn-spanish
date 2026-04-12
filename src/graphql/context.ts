import { db } from '#/db/index'
import { createLoaders } from '#/graphql/loaders'

export type GqlContext = {
  db: typeof db
  loaders: ReturnType<typeof createLoaders>
}
