import { Bell, BriefcaseBusiness } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../../app/providers/useAuth'
import { routePaths } from '../../../app/router/routePaths'
import { Navbar } from './Navbar'
import { ProfileDropdown } from './ProfileDropdown'
// Gaya aksi (notifikasi & profil) sama persis dengan navbar pelamar.
import styles from './ApplicantNavbar.module.css'

export function CompanyNavbar() {
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
            profileHref={routePaths.company.profile}
            user={user}
          />
        </div>
      }
      brandHref={routePaths.company.dashboard}
      brandIcon={BriefcaseBusiness}
      applicantStyle
      items={[
        {
          label: 'Lowongan Saya',
          to: routePaths.company.jobs,
          end: true,
        },
        {
          label: 'Posting Lowongan',
          to: routePaths.company.newJob,
          end: true,
        },
        {
          label: 'Kelola Lamaran',
          to: routePaths.company.applications,
          end: true,
        },
      ]}
      responsiveMenu
    />
  )
}
