import { createContext } from 'react'

export type UserRole = 'applicant' | 'company' | 'admin'
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthUser {
  id: string
  email: string | null
  role: UserRole | null
}

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  role: UserRole | null
  error?: string
}

export interface AuthContextValue extends AuthState {
  isConfigured: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
