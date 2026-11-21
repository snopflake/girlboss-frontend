import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../providers/useAuth'
import { routePaths } from './routePaths'

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <p role="status" aria-live="polite">
        Memeriksa sesi akun...
      </p>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to={routePaths.login}
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}
