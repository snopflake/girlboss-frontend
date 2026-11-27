import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  AuthApiError,
  authSessionStorageKey,
  getCurrentUser,
  loginWithApi,
} from '../../features/auth/api/authApi'
import { AuthContext, type AuthState, type UserRole } from './AuthContext'

const initialState: AuthState = {
  status: 'loading',
  user: null,
  role: null,
}

function toUserRole(role: string): UserRole | null {
  switch (role) {
    case 'APPLICANT':
      return 'applicant'
    case 'COMPANY':
      return 'company'
    case 'ADMIN':
      return 'admin'
    default:
      return null
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Sesi pengguna tidak dapat diperiksa.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [state, setState] = useState<AuthState>(() =>
    window.sessionStorage.getItem(authSessionStorageKey)
      ? initialState
      : { status: 'unauthenticated', user: null, role: null },
  )

  useEffect(() => {
    let active = true
    const accessToken = window.sessionStorage.getItem(authSessionStorageKey)

    if (!accessToken) {
      return () => {
        active = false
      }
    }

    void getCurrentUser(accessToken)
      .then((currentUser) => {
        if (!active) return
        const role = toUserRole(currentUser.role)
        if (!role) {
          throw new AuthApiError('Peran akun tidak dikenali.')
        }
        setState({
          status: 'authenticated',
          role,
          user: {
            id: currentUser.id,
            email: currentUser.email,
            fullName: currentUser.fullName,
            role,
          },
        })
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof AuthApiError && error.status === 401) {
          window.sessionStorage.removeItem(authSessionStorageKey)
        }
        setState({
          status: 'unauthenticated',
          user: null,
          role: null,
          error: errorMessage(error),
        })
      })

    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setState({ status: 'loading', user: null, role: null })
    try {
      const session = await loginWithApi(email, password)
      window.sessionStorage.setItem(authSessionStorageKey, session.accessToken)
      const currentUser = await getCurrentUser(session.accessToken)
      const role = toUserRole(currentUser.role)
      if (!role) {
        throw new AuthApiError('Peran akun tidak dikenali.')
      }

      const nextState: AuthState = {
        status: 'authenticated',
        role,
        user: {
          id: currentUser.id,
          email: currentUser.email,
          fullName: currentUser.fullName,
          role,
        },
      }
      setState(nextState)
      return role
    } catch (error) {
      window.sessionStorage.removeItem(authSessionStorageKey)
      setState({
        status: 'unauthenticated',
        user: null,
        role: null,
        error: errorMessage(error),
      })
      throw error
    }
  }, [])

  const signOut = useCallback(() => {
    window.sessionStorage.removeItem(authSessionStorageKey)
    queryClient.clear()
    setState({ status: 'unauthenticated', user: null, role: null })
  }, [queryClient])

  const value = useMemo(
    () => ({ ...state, signIn, signOut }),
    [signIn, signOut, state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
