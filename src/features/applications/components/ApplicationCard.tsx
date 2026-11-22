import { BriefcaseBusiness, CalendarDays, MapPin } from 'lucide-react'
import { useId } from 'react'
import { Button, Card } from '../../../design-system/components'
import type { MyApplication } from '../types/application.types'
import { canCancelApplication } from '../utils/applicationStatus'
import { formatDate, formatRelative } from '../utils/formatDate'
import { ApplicationProgress } from './ApplicationProgress'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'
import styles from './ApplicationCard.module.css'
import tones from './buttonTones.module.css'

interface ApplicationCardProps {
  application: MyApplication
  onViewDetail(application: MyApplication): void
  onCancel(application: MyApplication): void
  isCancelling?: boolean
}

export function ApplicationCard({
  application,
  onViewDetail,
  onCancel,
  isCancelling = false,
}: ApplicationCardProps) {
  const titleId = useId()

  return (
    <Card className={styles.card} variant="outlined" aria-labelledby={titleId}>
      <span className={styles.logo} aria-hidden="true">
        <BriefcaseBusiness size={24} />
      </span>

      <div className={styles.info}>
        <h2 id={titleId} className={styles.title}>
          {application.jobTitle}
        </h2>
        <p className={styles.company}>{application.companyName}</p>

        <ul className={styles.meta}>
          <li>
            <MapPin aria-hidden="true" size={16} />
            {application.location}
          </li>
          <li>
            <BriefcaseBusiness aria-hidden="true" size={16} />
            {application.employmentType}
          </li>
          <li>
            <CalendarDays aria-hidden="true" size={16} />
            Dikirim{' '}
            <time dateTime={application.submittedAt}>
              {formatDate(application.submittedAt)}
            </time>
          </li>
        </ul>

        <ApplicationProgress status={application.status} />

        <p className={styles.updated}>
          Terakhir diperbarui{' '}
          <time dateTime={application.updatedAt}>
            {formatRelative(application.updatedAt)}
          </time>
        </p>
      </div>

      <div className={styles.aside}>
        <ApplicationStatusBadge status={application.status} />
        <div className={styles.actions}>
          <Button
            variant="outline"
            size="small"
            className={tones.brandOutline}
            onClick={() => onViewDetail(application)}
            aria-label={`Lihat detail lamaran ${application.jobTitle} di ${application.companyName}`}
          >
            Lihat Detail
          </Button>
          {canCancelApplication(application.status) && (
            <Button
              variant="outline"
              size="small"
              className={tones.dangerOutline}
              onClick={() => onCancel(application)}
              disabled={isCancelling}
              aria-label={`Batalkan lamaran ${application.jobTitle} di ${application.companyName}`}
            >
              {isCancelling ? 'Membatalkan…' : 'Batalkan'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
