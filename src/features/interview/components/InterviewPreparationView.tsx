import { LoaderCircle, X } from 'lucide-react'
import { Button, Card } from '../../../design-system/components'
import styles from '../pages/InterviewPage.module.css'

interface InterviewPreparationViewProps {
  title: string
  onCancel(): void
  onRetry?(): void
  failed?: boolean
  errorMessage?: string
}

export function InterviewPreparationView({
  title,
  onCancel,
  onRetry,
  failed = false,
  errorMessage,
}: InterviewPreparationViewProps) {
  return (
    <Card className={styles.preparationCard}>
      <span
        className={[
          styles.preparationIcon,
          failed ? styles.preparationIconError : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      >
        {failed ? (
          <X size={28} />
        ) : (
          <LoaderCircle className={styles.spinner} size={28} />
        )}
      </span>
      <h2>
        {failed
          ? 'Pertanyaan Belum Siap'
          : 'Menyiapkan Pertanyaan Wawancara'}
      </h2>
      <p className={styles.mutedText}>{title}</p>
      {failed ? (
        <>
          <p className={styles.errorMessage} role="alert">
            {errorMessage ?? 'Sesi wawancara tidak dapat dibuat.'}
          </p>
          <div className={styles.setupActions}>
            <Button onClick={onRetry} type="button">
              Coba Lagi
            </Button>
            <Button onClick={onCancel} type="button" variant="outline">
              Kembali
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className={`${styles.statusBadge} ${styles.processingBadge}`}>
            <LoaderCircle className={styles.smallSpinner} size={15} />
            Diproses
          </span>
          <div
            aria-label="Permintaan pembuatan sesi sedang diproses"
            aria-valuemax={100}
            aria-valuemin={0}
            className={styles.progressTrack}
            role="progressbar"
          >
            <span className={`${styles.progressBar} ${styles.progressBarIndeterminate}`} />
          </div>
          <p className={styles.progressLabel} role="status">
            Menunggu pertanyaan dari layanan AI...
          </p>
        </>
      )}
    </Card>
  )
}
