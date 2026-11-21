import { Navigate, Outlet } from 'react-router'
import { type UserRole } from '../providers/AuthContext'
import { useAuth } from '../providers/useAuth'
import { routePaths } from './routePaths'

export function RoleGuard({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const { status, role } = useAuth()

  if (status === 'loading') {
    return (
      <p role="status" aria-live="polite">
        Memeriksa akses akun...
      </p>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to={routePaths.login} replace />
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={routePaths.forbidden} replace />
  }

  return <Outlet />
}
