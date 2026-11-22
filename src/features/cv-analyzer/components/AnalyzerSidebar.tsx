import { ArrowRight, Clock3, FileSearch, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import { Badge, Button, Card, Select } from '../../../design-system/components'
import type {
  AnalysisOutcome,
  AnalysisRecord,
} from '../types/cvAnalyzer'
import { formatCvDate } from '../utils/cvFormatters'
import styles from '../pages/CvAnalyzerPage.module.css'

interface AnalyzerSidebarProps {
  history: AnalysisRecord[]
  demoOutcome: AnalysisOutcome
  onDemoOutcomeChange(outcome: AnalysisOutcome): void
  onOpenHistory(): void
  onOpenRecord(record: AnalysisRecord): void
}

function statusLabel(status: AnalysisRecord['status']) {
  if (status === 'COMPLETED') return 'Selesai'
  if (status === 'PROCESSING') return 'Diproses'
  return 'Gagal'
}

function statusVariant(status: AnalysisRecord['status']) {
  if (status === 'COMPLETED') return 'success'
  if (status === 'PROCESSING') return 'info'
  return 'danger'
}

export function AnalyzerSidebar({
  history,
  demoOutcome,
  onDemoOutcomeChange,
  onOpenHistory,
  onOpenRecord,
}: AnalyzerSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Card className={styles.sidebarCard} padding="compact">
        <div className={styles.sidebarHeading}>
          <span className={styles.sidebarIcon} aria-hidden="true">
            <Clock3 size={18} />
          </span>
          <h2>Riwayat Analisis</h2>
        </div>
        {history.length === 0 ? (
          <p className={styles.sidebarDescription}>
            Belum ada riwayat analisis.
          </p>
        ) : (
          <ul className={styles.recentList}>
            {history.slice(0, 3).map((record) => (
              <li key={record.analysisId}>
                <button
                  className={styles.recentItem}
                  onClick={() => onOpenRecord(record)}
                  type="button"
                >
                  <span className={styles.recentFile}>
                    <FileSearch aria-hidden="true" size={16} />
                    <span title={record.name}>{record.name}</span>
                  </span>
                  <span className={styles.recentMeta}>
                    <span>{formatCvDate(record.analyzedAt)}</span>
                    <Badge variant={statusVariant(record.status)}>
                      {statusLabel(record.status)}
                    </Badge>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button
          className={styles.fullWidthButton}
          onClick={onOpenHistory}
          size="small"
          type="button"
          variant="ghost"
        >
          Lihat semua riwayat
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </Card>

      <Card className={styles.sidebarCard} padding="compact">
        <div className={styles.sidebarHeading}>
          <span className={styles.sidebarIcon} aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <h2>Tentang Analisis AI</h2>
        </div>
        <p className={styles.sidebarDescription}>
          Tampilan ini memakai data dan progres simulasi lokal. Dokumen tidak
          dikirim ke server atau layanan AI.
        </p>
        <ul className={styles.infoList}>
          <li>Format CV: PDF atau DOCX</li>
          <li>Ukuran maksimum: 5 MB</li>
          <li>Batas ukuran perlu diselaraskan dengan backend.</li>
        </ul>
        <div className={styles.demoControl}>
          <label htmlFor="demo-outcome">Hasil simulasi demo</label>
          <Select
            id="demo-outcome"
            onChange={(event) =>
              onDemoOutcomeChange(
                event.currentTarget.value === 'FAILED' ? 'FAILED' : 'COMPLETED',
              )
            }
            value={demoOutcome}
          >
            <option value="COMPLETED">Selesai</option>
            <option value="FAILED">Gagal</option>
          </Select>
        </div>
        <Link className={styles.sidebarLink} to={routePaths.applicant.interview}>
          Lanjutkan ke AI Interview
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Card>
    </aside>
  )
}
