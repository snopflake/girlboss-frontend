import { Circle, LoaderCircle } from 'lucide-react'
import { Button, Card } from '../../../design-system/components'
import styles from '../pages/CvAnalyzerPage.module.css'

const analysisSteps = [
  'Validasi dokumen',
  'Menganalisis dengan AI',
  'Menyusun hasil evaluasi',
]

interface ProcessingViewProps {
  documentName: string
  mode?: 'analysis' | 'history'
  onBackToHistory?(): void
}

export function ProcessingView({
  documentName,
  mode = 'analysis',
  onBackToHistory,
}: ProcessingViewProps) {
  const isHistoricalAnalysis = mode === 'history'

  return (
    <Card className={styles.processingCard}>
      <div className={styles.processingIcon} aria-hidden="true">
        <LoaderCircle className={styles.spinner} size={30} />
      </div>
      <h2>
        {isHistoricalAnalysis
          ? 'Analisis Masih Diproses'
          : 'Sedang Menganalisis CV Kamu'}
      </h2>
      <p className={styles.mutedText}>
        {isHistoricalAnalysis
          ? `${documentName}. Periksa kembali riwayat nanti untuk melihat hasilnya.`
          : documentName}
      </p>
      <span className={`${styles.statusBadge} ${styles.processingBadge}`}>
        <LoaderCircle className={styles.smallSpinner} size={15} />
        Diproses
      </span>
      <div className={styles.progressTrack}>
        <div
          aria-label="Analisis CV sedang diproses"
          aria-valuetext="Menunggu hasil dari backend"
          className={`${styles.progressBar} ${styles.indeterminateProgressBar}`}
          role="progressbar"
        />
      </div>
      <p className={styles.progressLabel} role="status">
        {isHistoricalAnalysis
          ? 'Backend melaporkan status PROCESSING.'
          : 'Menunggu hasil analisis dari backend...'}
      </p>
      {!isHistoricalAnalysis && (
        <ol className={styles.steps}>
          {analysisSteps.map((step, index) => (
            <li className={styles.step} key={step}>
              <span className={styles.stepIcon} aria-hidden="true">
                {index === 0 ? (
                  <LoaderCircle className={styles.smallSpinner} size={16} />
                ) : (
                  <Circle size={16} />
                )}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
      {isHistoricalAnalysis && onBackToHistory && (
        <Button
          onClick={onBackToHistory}
          type="button"
          variant="outline"
        >
          Kembali ke riwayat
        </Button>
      )}
    </Card>
  )
}
