import { createContext, type ReactNode, useContext } from 'react'

export type AuthUser = {
  email: string
  name: string
}

const AuthUserContext = createContext<AuthUser | null | undefined>(undefined)

export function AuthUserProvider({
  user,
  children,
}: {
  user: AuthUser | null | undefined
  children: ReactNode
}) {
  return <AuthUserContext.Provider value={user ?? null}>{children}</AuthUserContext.Provider>
}

export function useAuthUser(): AuthUser | null {
  const value = useContext(AuthUserContext)
  if (value === undefined) {
    throw new Error('useAuthUser must be used within AuthUserProvider')
  }
  return value
}
