import { createClient, type Session } from '@supabase/supabase-js'
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type AuthState, type UserRole } from './AuthContext'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

const initialState: AuthState = {
  status: 'loading',
  user: null,
  role: null,
}

function isUserRole(role: unknown): role is UserRole {
  return role === 'applicant' || role === 'company' || role === 'admin'
}

function authStateFromSession(session: Session | null): AuthState {
  if (!session) {
    return { status: 'unauthenticated', user: null, role: null }
  }

  const metadataRole: unknown = session.user.app_metadata['role']
  const role = isUserRole(metadataRole) ? metadataRole : null

  return {
    status: 'authenticated',
    role,
    user: {
      id: session.user.id,
      email: session.user.email ?? null,
      role,
    },
  }
}

function authErrorState(error: unknown): AuthState {
  const message =
    error instanceof Error ? error.message : 'Sesi pengguna tidak dapat diperiksa.'

  console.error('Unable to restore the Supabase session:', error)
  return {
    status: 'unauthenticated',
    user: null,
    role: null,
    error: message,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() =>
    supabase
      ? initialState
      : { status: 'unauthenticated', user: null, role: null },
  )

  useEffect(() => {
    if (!supabase) {
      return
    }

    let active = true
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setState(authStateFromSession(session))
      }
    })

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) {
          return
        }

        if (error) {
          setState(authErrorState(error))
          return
        }

        setState(authStateFromSession(data.session))
      })
      .catch((error: unknown) => {
        if (active) {
          setState(authErrorState(error))
        }
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, isConfigured: Boolean(supabase) }}>
      {children}
    </AuthContext.Provider>
  )
}
