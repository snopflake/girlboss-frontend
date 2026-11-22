import type { ApplicationStatus } from '../types/application.types'
import {
  applicationStageShortLabels,
  applicationStages,
  getStageIndex,
} from '../utils/applicationStatus'
import styles from './ApplicationProgress.module.css'

export function ApplicationProgress({ status }: { status: ApplicationStatus }) {
  const currentIndex = getStageIndex(status)

  return (
    <ol className={styles.progress} aria-label="Progres lamaran">
      {applicationStages.map((stage, index) => {
        const isReached = index <= currentIndex
        const isCurrent = index === currentIndex
        const isDecision = stage === 'decision' && isReached
        const dotClass = isDecision
          ? status === 'accepted'
            ? styles.dotAccepted
            : styles.dotRejected
          : isCurrent
            ? styles.dotCurrent
            : isReached
              ? styles.dotDone
              : styles.dotUpcoming

        return (
          <li
            key={stage}
            className={[styles.step, isReached ? styles.reached : '']
              .filter(Boolean)
              .join(' ')}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {index > 0 && <span className={styles.connector} aria-hidden="true" />}
            <span className={[styles.dot, dotClass].join(' ')} aria-hidden="true" />
            <span className={styles.label}>{applicationStageShortLabels[stage]}</span>
          </li>
        )
      })}
    </ol>
  )
}
