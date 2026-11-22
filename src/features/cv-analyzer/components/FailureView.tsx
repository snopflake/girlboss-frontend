import { AlertTriangle, FileSearch, RotateCcw } from 'lucide-react'
import { Button, Card } from '../../../design-system/components'
import styles from '../pages/CvAnalyzerPage.module.css'

interface FailureViewProps {
  documentName: string
  message: string
  details: string
  onRetry(): void
  onChooseAnother(): void
}

export function FailureView({
  documentName,
  message,
  details,
  onRetry,
  onChooseAnother,
}: FailureViewProps) {
  return (
    <Card className={styles.failureCard}>
      <span className={styles.failureIcon} aria-hidden="true">
        <AlertTriangle size={30} />
      </span>
      <h2>Analisis Gagal Diproses</h2>
      <p className={styles.mutedText}>{documentName}</p>
      <p className={styles.failureMessage}>{message}</p>
      <span className={`${styles.statusBadge} ${styles.failureBadge}`}>
        <AlertTriangle size={15} />
        Gagal
      </span>
      <details className={styles.errorDetails}>
        <summary>Detail Kesalahan</summary>
        <pre>{details}</pre>
      </details>
      <div className={styles.resultActions}>
        <Button
          leadingIcon={<RotateCcw size={17} />}
          onClick={onRetry}
          type="button"
        >
          Coba Lagi
        </Button>
        <Button
          leadingIcon={<FileSearch size={17} />}
          onClick={onChooseAnother}
          type="button"
          variant="outline"
        >
          Pilih CV Lain
        </Button>
      </div>
      <p className={styles.simulationNotice} role="note">
        Status ini merupakan simulasi untuk demo, bukan hasil pemrosesan AI.
      </p>
    </Card>
  )
}
