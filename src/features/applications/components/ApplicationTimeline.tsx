import { Check, X } from 'lucide-react'
import type { MyApplication } from '../types/application.types'
import {
  applicationStageTimelineLabels,
  applicationStages,
  applicationStatusLabels,
  getStageIndex,
} from '../utils/applicationStatus'
import { formatDateTime } from '../utils/formatDate'
import styles from './ApplicationTimeline.module.css'

export function ApplicationTimeline({ application }: { application: MyApplication }) {
  const currentIndex = getStageIndex(application.status)

  return (
    <ol className={styles.timeline}>
      {applicationStages.map((stage, index) => {
        const isReached = index <= currentIndex
        const isRejectedDecision =
          stage === 'decision' && isReached && application.status === 'rejected'
        const date = application.stageDates[stage]

        let description = 'Belum dimulai'
        if (isReached) {
          description = date ? formatDateTime(date) : 'Dilewati'
          if (stage === 'decision') {
            description = `${applicationStatusLabels[application.status]} • ${description}`
          }
        }

        const markerClass = isRejectedDecision
          ? styles.rejected
          : isReached
            ? styles.done
            : styles.upcoming

        return (
          <li
            key={stage}
            className={styles.step}
            aria-current={index === currentIndex ? 'step' : undefined}
          >
            <span className={[styles.marker, markerClass].join(' ')} aria-hidden="true">
              {isRejectedDecision ? (
                <X size={16} />
              ) : isReached ? (
                <Check size={16} />
              ) : (
                index + 1
              )}
            </span>
            <div className={styles.text}>
              <span className={styles.title}>
                {applicationStageTimelineLabels[stage]}
                <span className={styles.visuallyHidden}>
                  {isReached ? ' (selesai)' : ' (belum dimulai)'}
                </span>
              </span>
              <span className={styles.date}>
                {date && isReached ? (
                  <time dateTime={date}>{description}</time>
                ) : (
                  description
                )}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
