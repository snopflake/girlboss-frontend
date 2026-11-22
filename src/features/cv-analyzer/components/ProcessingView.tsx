import { Check, Circle, LoaderCircle, X } from 'lucide-react'
import { Button, Card } from '../../../design-system/components'
import styles from '../pages/CvAnalyzerPage.module.css'

const analysisSteps = [
  'Validasi dokumen',
  'Menganalisis dengan AI',
  'Menyusun hasil evaluasi',
]

interface ProcessingViewProps {
  documentName: string
  progress: number
  onCancel(): void
}

export function ProcessingView({
  documentName,
  progress,
  onCancel,
}: ProcessingViewProps) {
  const activeStep = progress < 28 ? 0 : progress < 70 ? 1 : 2

  return (
    <Card className={styles.processingCard}>
      <div className={styles.processingIcon} aria-hidden="true">
        <LoaderCircle className={styles.spinner} size={30} />
      </div>
      <h2>Sedang Menganalisis CV Kamu</h2>
      <p className={styles.mutedText}>{documentName}</p>
      <span className={`${styles.statusBadge} ${styles.processingBadge}`}>
        <LoaderCircle className={styles.smallSpinner} size={15} />
        Diproses
      </span>
      <div className={styles.progressTrack}>
        <div
          aria-label="Progress simulasi analisis"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className={styles.progressBar}
          role="progressbar"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className={styles.progressLabel}>{progress}% selesai</p>
      <ol className={styles.steps}>
        {analysisSteps.map((step, index) => (
          <li
            className={[
              styles.step,
              index < activeStep ? styles.stepDone : '',
              index === activeStep ? styles.stepActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={step}
          >
            <span className={styles.stepIcon} aria-hidden="true">
              {index < activeStep ? (
                <Check size={16} />
              ) : index === activeStep ? (
                <LoaderCircle className={styles.smallSpinner} size={16} />
              ) : (
                <Circle size={16} />
              )}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className={styles.simulationNotice} role="status">
        Proses ini hanya simulasi lokal; AI belum menganalisis dokumen.
      </p>
      <Button
        leadingIcon={<X size={16} />}
        onClick={onCancel}
        type="button"
        variant="outline"
      >
        Batalkan
      </Button>
    </Card>
  )
}
