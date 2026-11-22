import { Outlet } from 'react-router'
import { ApplicantNavbar } from './components/Navbar/ApplicantNavbar'
import { Footer } from './components/Footer/Footer'
import { PageContainer } from './components/PageContainer/PageContainer'
import styles from './ApplicantLayout.module.css'

export function ApplicantLayout() {
  return (
    <div className={styles.layout}>
      <ApplicantNavbar />
      <div className={styles.workspace}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
      <Footer />
    </div>
  )
}
