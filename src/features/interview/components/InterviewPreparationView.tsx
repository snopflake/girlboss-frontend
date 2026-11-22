import { Check, Circle, LoaderCircle, X } from 'lucide-react'
import { Button, Card } from '../../../design-system/components'
import styles from '../pages/InterviewPage.module.css'

interface InterviewPreparationViewProps {
  title: string
  progress: number
  onCancel(): void
  onRetry?(): void
  failed?: boolean
}

const setupSteps = [
  'Menyiapkan konteks pekerjaan',
  'Memuat pertanyaan latihan',
  'Menyiapkan ruang sesi',
]

export function InterviewPreparationView({
  title,
  progress,
  onCancel,
  onRetry,
  failed = false,
}: InterviewPreparationViewProps) {
  const activeStep = Math.min(Math.floor(progress / 34), setupSteps.length - 1)

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
            Simulasi gagal menyiapkan sesi. Tidak ada pertanyaan yang dibuat
            oleh layanan AI.
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
            aria-label="Progress persiapan sesi"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className={styles.progressTrack}
            role="progressbar"
          >
            <span
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressLabel}>{progress}% selesai</p>
          <ol className={styles.preparationSteps}>
            {setupSteps.map((step, index) => (
              <li
                className={
                  index < activeStep
                    ? styles.stepDone
                    : index === activeStep
                      ? styles.stepActive
                      : ''
                }
                key={step}
              >
                {index < activeStep ? (
                  <Check size={17} aria-hidden="true" />
                ) : index === activeStep ? (
                  <LoaderCircle
                    className={styles.smallSpinner}
                    size={17}
                    aria-hidden="true"
                  />
                ) : (
                  <Circle size={17} aria-hidden="true" />
                )}
                {step}
              </li>
            ))}
          </ol>
          <p className={styles.simulationNotice} role="note">
            Ini hanya simulasi lokal; pertanyaan sudah disiapkan sebagai data
            contoh.
          </p>
          <Button onClick={onCancel} type="button" variant="outline">
            Batalkan
          </Button>
        </>
      )}
    </Card>
  )
}
