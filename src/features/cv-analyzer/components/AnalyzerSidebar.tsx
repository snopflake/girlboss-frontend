import {
  ArrowRight,
  Clock3,
  Eye,
  FileSearch,
  LoaderCircle,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import { Badge, Button, Card } from '../../../design-system/components'
import type { AnalysisRecord } from '../types/cvAnalyzer'
import { formatCvDate } from '../utils/cvFormatters'
import styles from '../pages/CvAnalyzerPage.module.css'

interface AnalyzerSidebarProps {
  history: AnalysisRecord[]
  loading: boolean
  error: string | null
  selectedAnalysisId: string | null
  onOpenHistory(): void
  onOpenRecord(record: AnalysisRecord): void
  onRetryLoad(): void
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
  loading,
  error,
  selectedAnalysisId,
  onOpenHistory,
  onOpenRecord,
  onRetryLoad,
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
        {loading && history.length === 0 ? (
          <p className={styles.sidebarDescription} role="status">
            Memuat riwayat...
          </p>
        ) : error && history.length === 0 ? (
          <div className={styles.sidebarDescription} role="alert">
            <p>{error}</p>
            <Button
              onClick={onRetryLoad}
              size="small"
              type="button"
              variant="outline"
            >
              Coba lagi
            </Button>
          </div>
        ) : history.length === 0 ? (
          <p className={styles.sidebarDescription}>
            Belum ada riwayat analisis.
          </p>
        ) : (
          <ul className={styles.recentList}>
            {history.slice(0, 3).map((record) => (
              <li key={record.analysisId}>
                <button
                  className={styles.recentItem}
                  disabled={selectedAnalysisId === record.analysisId}
                  onClick={() => onOpenRecord(record)}
                  type="button"
                >
                  <span className={styles.recentFile}>
                    {selectedAnalysisId === record.analysisId ? (
                      <LoaderCircle
                        aria-hidden="true"
                        className={styles.smallSpinner}
                        size={16}
                      />
                    ) : (
                      <FileSearch aria-hidden="true" size={16} />
                    )}
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
        {error && history.length > 0 && (
          <p className={styles.sidebarDescription} role="status">
            Riwayat tidak dapat diperbarui: {error}
          </p>
        )}
        <Button
          className={styles.fullWidthButton}
          leadingIcon={<Eye size={16} />}
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
          CV tersimpan diproses oleh backend menggunakan Gemini. Hasil hanya
          ditampilkan setelah analisis berhasil.
        </p>
        <ul className={styles.infoList}>
          <li>Format CV: PDF atau DOCX</li>
          <li>Ukuran maksimum: 10 MiB</li>
          <li>Maksimum 5 CV tersimpan</li>
          <li>Maksimum 3 analisis per 24 jam</li>
        </ul>
        <Link className={styles.sidebarLink} to={routePaths.applicant.interview}>
          Lanjutkan ke AI Interview
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Card>
    </aside>
  )
}
