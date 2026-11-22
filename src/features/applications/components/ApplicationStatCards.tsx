import type { LucideIcon } from 'lucide-react'
import { Card } from '../../../design-system/components'
import styles from './ApplicationStatCards.module.css'

export type StatTone = 'brand' | 'neutral' | 'info' | 'accent' | 'success' | 'danger'

export interface StatItem {
  label: string
  value: number
  tone: StatTone
  /** Opsional: frame pelamar memakai ikon, frame perusahaan tidak. */
  icon?: LucideIcon
}

interface ApplicationStatCardsProps {
  items: StatItem[]
  label?: string
}

export function ApplicationStatCards({
  items,
  label = 'Ringkasan lamaran',
}: ApplicationStatCardsProps) {
  return (
    <ul className={styles.grid} aria-label={label}>
      {items.map(({ label: itemLabel, value, tone, icon: Icon }) => (
        <li key={itemLabel}>
          <Card
            variant="outlined"
            padding="compact"
            className={[styles.card, styles[tone]].join(' ')}
          >
            {Icon && (
              <span className={styles.icon} aria-hidden="true">
                <Icon size={24} />
              </span>
            )}
            <div className={styles.text}>
              <span className={styles.label}>{itemLabel}</span>
              <span className={styles.value}>{value}</span>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}
