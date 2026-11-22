import { routePaths } from '../../../app/router/routePaths'
import { HomeLanding } from '../components/HomeLanding'

export default function ApplicantDashboardPage() {
  return (
    <HomeLanding primaryAction={{ label: 'Cari Lowongan Kerja', to: routePaths.applicant.jobs }} />
  )
}
