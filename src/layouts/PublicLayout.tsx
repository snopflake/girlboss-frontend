import { Link, Outlet } from 'react-router'
import { routePaths } from '../app/router/routePaths'
import { Footer } from './components/Footer/Footer'
import { Navbar } from './components/Navbar/Navbar'
import { PageContainer } from './components/PageContainer/PageContainer'
import styles from './PublicLayout.module.css'

export function PublicLayout() {
  return (
    <div className={styles.layout}>
      <Navbar
        brandHref={routePaths.home}
        items={[
          { label: 'Beranda', to: routePaths.home, end: true },
          { label: 'Lowongan', to: routePaths.jobs },
          { label: 'Kalender Acara', to: routePaths.eventList },
        ]}
        actions={
          <>
            <Link className={styles.loginLink} to={routePaths.login}>
              Masuk
            </Link>
            <Link className={styles.registerLink} to={routePaths.register}>
              Daftar
            </Link>
          </>
        }
      />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer />
    </div>
  )
}
