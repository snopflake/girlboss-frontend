import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '../../../design-system/components'
import styles from './EventsStateCard.module.css'

interface EventsStateCardProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  tone?: 'brand' | 'danger'
  role?: 'status' | 'alert'
}

/** Empty state, data tidak ditemukan, dan error untuk fitur Event. */
export function EventsStateCard({
  icon: Icon,
  title,
  description,
  action,
  tone = 'brand',
  role = 'status',
}: EventsStateCardProps) {
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
