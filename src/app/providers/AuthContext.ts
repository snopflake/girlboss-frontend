import { createContext } from 'react'

export type UserRole = 'applicant' | 'company' | 'admin'
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthUser {
  id: string
  email: string | null
  fullName: string | null
  role: UserRole | null
}

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  role: UserRole | null
  error?: string
}

export interface AuthContextValue extends AuthState {
  signIn(email: string, password: string): Promise<UserRole>
  signOut(): void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
