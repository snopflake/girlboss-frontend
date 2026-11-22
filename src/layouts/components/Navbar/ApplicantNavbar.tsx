import { Bell, BriefcaseBusiness } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../../app/providers/useAuth'
import { routePaths } from '../../../app/router/routePaths'
import { Navbar } from './Navbar'
import { ProfileDropdown } from './ProfileDropdown'
import styles from './ApplicantNavbar.module.css'

export function ApplicantNavbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate(routePaths.login, { replace: true })
  }

  return (
    <Navbar
      actions={
        <div className={styles.actions}>
          <span
            aria-label="Notifikasi; belum tersedia"
            className={styles.notifications}
            title="Notifikasi belum tersedia"
          >
            <Bell aria-hidden="true" size={19} />
          </span>
          <ProfileDropdown
            onSignOut={handleSignOut}
            profileHref={routePaths.applicant.profile}
            user={user}
          />
        </div>
      }
      brandHref={routePaths.applicant.dashboard}
      brandIcon={BriefcaseBusiness}
      applicantStyle
      items={[
        {
          label: 'Lowongan',
          to: routePaths.applicant.jobs,
          end: true,
        },
        {
          label: 'Lamaran Saya',
          to: routePaths.applicant.applications,
          end: true,
        },
        {
          label: 'Acara',
          to: routePaths.applicant.events,
          end: true,
        },
        {
          label: 'AI CV Analyzer',
          to: routePaths.applicant.cvAnalyzer,
          end: true,
        },
        {
          label: 'AI Interview',
          to: routePaths.applicant.interview,
          end: true,
        },
      ]}
      responsiveMenu
    />
  )
}
