import { Outlet } from 'react-router'
import { CompanyNavbar } from './components/Navbar/CompanyNavbar'
import { Footer } from './components/Footer/Footer'
import { PageContainer } from './components/PageContainer/PageContainer'
// Struktur layout (navbar atas, tanpa sidebar) sama dengan layout pelamar.
import styles from './ApplicantLayout.module.css'

export function CompanyLayout() {
  return (
    <div className={styles.layout}>
      <CompanyNavbar />
      <div className={styles.workspace}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
      <Footer />
    </div>
  )
}
