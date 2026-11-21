import {
  BriefcaseBusiness,
  Building2,
  Inbox,
  LayoutDashboard,
} from 'lucide-react'
import { routePaths } from '../app/router/routePaths'
import { PortalLayout } from './PortalLayout'

export function CompanyLayout() {
  return (
    <PortalLayout
      label="Ruang Perusahaan"
      brandHref={routePaths.company.dashboard}
      navigation={[
        {
          label: 'Dashboard',
          to: routePaths.company.dashboard,
          icon: LayoutDashboard,
          end: true,
        },
        {
          label: 'Kelola Lowongan',
          to: routePaths.company.jobs,
          icon: BriefcaseBusiness,
        },
        {
          label: 'Lamaran Masuk',
          to: routePaths.company.applications,
          icon: Inbox,
        },
        {
          label: 'Profil Perusahaan',
          to: routePaths.company.profile,
          icon: Building2,
        },
      ]}
    />
  )
}
