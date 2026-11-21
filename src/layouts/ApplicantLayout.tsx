import {
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  LayoutDashboard,
  ScanSearch,
  Sparkles,
  UserRound,
  Video,
} from 'lucide-react'
import { PortalLayout } from './PortalLayout'
import { routePaths } from '../app/router/routePaths'

export function ApplicantLayout() {
  return (
    <PortalLayout
      label="Ruang Pelamar"
      brandHref={routePaths.applicant.dashboard}
      navigation={[
        {
          label: 'Beranda',
          to: routePaths.applicant.dashboard,
          icon: LayoutDashboard,
          end: true,
        },
        {
          label: 'Lowongan Kerja',
          to: routePaths.applicant.jobs,
          icon: BriefcaseBusiness,
          end: true,
        },
        {
          label: 'Lowongan Tersimpan',
          to: routePaths.applicant.savedJobs,
          icon: Bookmark,
        },
        {
          label: 'Lamaran Saya',
          to: routePaths.applicant.applications,
          icon: FileText,
        },
        {
          label: 'Kalender Acara',
          to: routePaths.applicant.events,
          icon: CalendarDays,
        },
        {
          label: 'AI Tools',
          icon: Sparkles,
          items: [
            {
              label: 'AI CV Analyzer',
              to: routePaths.applicant.cvAnalyzer,
              icon: ScanSearch,
            },
            {
              label: 'AI Interview Preparation',
              to: routePaths.applicant.interview,
              icon: Video,
            },
          ],
        },
        {
          label: 'Profil',
          to: routePaths.applicant.profile,
          icon: UserRound,
        },
      ]}
    />
  )
}
