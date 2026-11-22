import { Badge, type BadgeVariant } from '../../../design-system/components'
import type { ApplicationStatus } from '../types/application.types'
import { applicationStatusLabels } from '../utils/applicationStatus'
import styles from './ApplicationStatusBadge.module.css'

const statusVariants: Record<ApplicationStatus, BadgeVariant> = {
  submitted: 'neutral',
  reviewed: 'info',
  interview: 'primary',
  accepted: 'success',
  rejected: 'danger',
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge
      variant={statusVariants[status]}
      className={[styles.badge, status === 'interview' ? styles.interview : '']
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.visuallyHidden}>Status: </span>
      {applicationStatusLabels[status]}
    </Badge>
  )
}
