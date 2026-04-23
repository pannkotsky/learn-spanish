import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db } from '#/db'

const defaultPort = process.env.PORT ?? (process.env.NODE_ENV === 'production' ? 4173 : 3000)

export const auth = betterAuth({
  appName: 'Learn Spanish',
  baseURL:
    process.env.BETTER_AUTH_URL ??
    process.env.VITE_APP_URL ??
    process.env.APP_URL ??
    `http://localhost:${defaultPort}`,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [tanstackStartCookies()],
})
