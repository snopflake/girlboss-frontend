import { LayoutDashboard } from 'lucide-react'
import { routePaths } from '../app/router/routePaths'
import { PortalLayout } from './PortalLayout'

export function AdminLayout() {
  return (
    <PortalLayout
      label="Administrasi"
      brandHref={routePaths.admin.dashboard}
      navigation={[
        {
          label: 'Dashboard Admin',
          to: routePaths.admin.dashboard,
          icon: LayoutDashboard,
          end: true,
        },
      ]}
    />
  )
}
