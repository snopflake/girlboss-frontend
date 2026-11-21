import { Link } from 'react-router'
import { Card } from '../../design-system/components'
import styles from './RouteMessagePage.module.css'

interface RouteMessagePageProps {
  code: string
  title: string
  description: string
  linkLabel: string
  linkTo: string
}

export function RouteMessagePage({
  code,
  title,
  description,
  linkLabel,
  linkTo,
}: RouteMessagePageProps) {
  return (
    <main className={styles.page}>
      <Card className={styles.card}>
        <p className={styles.code}>{code}</p>
        <h1>{title}</h1>
        <p className={styles.description}>{description}</p>
        <Link className={styles.link} to={linkTo}>
          {linkLabel}
        </Link>
      </Card>
    </main>
  )
}
