import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '../../../design-system/components'
import styles from './ApplicationsStateCard.module.css'

interface ApplicationsStateCardProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  tone?: 'brand' | 'danger'
  /** Pakai `alert` untuk kondisi error agar diumumkan pembaca layar. */
  role?: 'status' | 'alert'
}

/** Kartu untuk empty state, hasil pencarian kosong, data tidak ditemukan, dan error. */
export function ApplicationsStateCard({
  icon: Icon,
  title,
  description,
  action,
  tone = 'brand',
  role = 'status',
}: ApplicationsStateCardProps) {
  return (
    <Card variant="outlined" className={styles.card} role={role}>
      <span className={[styles.icon, styles[tone]].join(' ')} aria-hidden="true">
        <Icon size={32} />
      </span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {action}
    </Card>
  )
}
