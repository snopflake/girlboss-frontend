import { Outlet } from 'react-router'
import { Footer } from './components/Footer/Footer'
import { Navbar } from './components/Navbar/Navbar'
import { PageContainer } from './components/PageContainer/PageContainer'
import { Sidebar } from './components/Sidebar/Sidebar'
import type { SidebarItem } from './navigation'
import styles from './PortalLayout.module.css'

interface PortalLayoutProps {
  label: string
  brandHref: string
  navigation: SidebarItem[]
}

export function PortalLayout({
  label,
  brandHref,
  navigation,
}: PortalLayoutProps) {
  return (
    <div className={styles.layout}>
      <Navbar brandHref={brandHref} contextLabel={label} />
      <div className={styles.workspace}>
        <Sidebar label={`Navigasi ${label}`} items={navigation} />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
      <Footer />
    </div>
  )
}
