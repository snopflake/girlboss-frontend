import { ArrowLeft, CheckCircle2, FilePlus2, RotateCcw } from 'lucide-react'
import { Badge, Button, Card } from '../../../design-system/components'
import type { CvAnalysisResult } from '../types/cvAnalyzer'
import { formatCvDate } from '../utils/cvFormatters'
import styles from '../pages/CvAnalyzerPage.module.css'

interface ResultViewProps {
  documentName: string
  analyzedAt: string
  result: CvAnalysisResult
  onAnalyzeAgain(): void
  onUploadNew(): void
  onBackToSelection(): void
  backLabel?: string
}

export function ResultView({
  documentName,
  analyzedAt,
  result,
  onAnalyzeAgain,
  onUploadNew,
  onBackToSelection,
  backLabel = 'Kembali ke pilihan CV',
}: ResultViewProps) {
  return (
    <div className={styles.resultView}>
      <header className={styles.resultBanner}>
        <span className={styles.resultIcon} aria-hidden="true">
          <CheckCircle2 size={26} />
        </span>
        <div>
          <div className={styles.resultTitleRow}>
            <h2>Analisis Selesai</h2>
            <Badge variant="neutral">Analisis AI</Badge>
          </div>
          <p>{documentName}</p>
          <span>Analisis: {formatCvDate(analyzedAt)}</span>
        </div>
      </header>

      <Card className={styles.resultSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.score}>{result.score}</span>
          <div>
            <h3>Ringkasan Evaluasi</h3>
            <p>Skor kualitas CV</p>
          </div>
        </div>
        <p className={styles.resultSummary}>{result.summary}</p>
      </Card>

      <div className={styles.resultColumns}>
        <Card className={styles.resultSection}>
          <h3 className={styles.listHeading}>
            <CheckCircle2 size={19} aria-hidden="true" />
            Kelebihan CV
          </h3>
          <ul className={styles.feedbackList}>
            {result.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card className={styles.resultSection}>
          <h3 className={styles.listHeading}>
            <span className={styles.warningDot} aria-hidden="true" />
            Kekurangan CV
          </h3>
          <ul className={styles.feedbackList}>
            {result.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className={styles.resultSection}>
        <h3 className={styles.listHeading}>
          <RotateCcw size={19} aria-hidden="true" />
          Rekomendasi Perbaikan
        </h3>
        <ol className={styles.feedbackList}>
          {result.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Card>

      <div className={styles.resultActions}>
        <Button
          leadingIcon={<RotateCcw size={17} />}
          onClick={onAnalyzeAgain}
          type="button"
          variant="outline"
        >
          Analisis Ulang
        </Button>
        <Button
          leadingIcon={<FilePlus2 size={17} />}
          onClick={onUploadNew}
          type="button"
        >
          Unggah CV Baru
        </Button>
        <Button
          leadingIcon={<ArrowLeft size={17} />}
          onClick={onBackToSelection}
          type="button"
          variant="ghost"
        >
          {backLabel}
        </Button>
      </div>
    </div>
  )
}
