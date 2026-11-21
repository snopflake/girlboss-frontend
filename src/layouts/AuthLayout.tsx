import { ArrowLeft, Sparkles } from 'lucide-react'
import { Link, Outlet } from 'react-router'
import { Card } from '../design-system/components'
import { routePaths } from '../app/router/routePaths'
import styles from './AuthLayout.module.css'

export function AuthLayout() {
  return (
    <main className={styles.layout}>
      <Card className={styles.card}>
        <Link className={styles.brand} to={routePaths.home}>
          <span className={styles.brandIcon} aria-hidden="true">
            <Sparkles size={20} />
          </span>
          GirlBoss
        </Link>
        <Link className={styles.backLink} to={routePaths.home}>
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke beranda
        </Link>
        <div className={styles.content}>
          <Outlet />
        </div>
      </Card>
    </main>
  )
}
