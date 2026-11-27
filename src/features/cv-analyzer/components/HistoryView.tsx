import {
  ArrowLeft,
  ArrowRight,
  Eye,
  FilePlus2,
  FolderX,
  LoaderCircle,
  Search,
} from 'lucide-react'
import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
} from '../../../design-system/components'
import type {
  AnalysisRecord,
  AnalysisStatus,
} from '../types/cvAnalyzer'
import { formatCvDate } from '../utils/cvFormatters'
import styles from '../pages/CvAnalyzerPage.module.css'

type StatusFilter = 'ALL' | AnalysisStatus

interface HistoryViewProps {
  history: AnalysisRecord[]
  page: number
  total: number
  totalPages: number
  loading: boolean
  error: string | null
  selectedAnalysisId: string | null
  onPageChange(page: number): void
  onRetryLoad(): void
  onAnalyzeNew(): void
  onOpenRecord(record: AnalysisRecord): void
}

function toStatusFilter(value: string): StatusFilter {
  if (
    value === 'COMPLETED' ||
    value === 'PROCESSING' ||
    value === 'FAILED'
  ) {
    return value
  }
  return 'ALL'
}

function statusLabel(status: AnalysisStatus) {
  if (status === 'COMPLETED') return 'Selesai'
  if (status === 'PROCESSING') return 'Diproses'
  return 'Gagal'
}

function statusVariant(status: AnalysisStatus) {
  if (status === 'COMPLETED') return 'success'
  if (status === 'PROCESSING') return 'info'
  return 'danger'
}

export function HistoryView({
  history,
  page,
  total,
  totalPages,
  loading,
  error,
  selectedAnalysisId,
  onPageChange,
  onRetryLoad,
  onAnalyzeNew,
  onOpenRecord,
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const filteredHistory = history.filter((record) => {
    const matchesSearch = record.name
      .toLocaleLowerCase('id-ID')
      .includes(searchTerm.trim().toLocaleLowerCase('id-ID'))
    const matchesStatus =
      statusFilter === 'ALL' || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card className={styles.historyCard}>
      <header className={styles.historyHeader}>
        <div>
          <h2>Riwayat Analisis</h2>
          <p>Riwayat analisis CV yang tersimpan di akunmu.</p>
        </div>
        <Button
          leadingIcon={<FilePlus2 size={17} />}
          onClick={onAnalyzeNew}
          type="button"
        >
          Analisis CV Baru
        </Button>
      </header>

      {loading && (
        <p className={styles.progressLabel} role="status">
          Memuat riwayat analisis...
        </p>
      )}

      {error && (
        <div className={styles.validationSummary} role="alert">
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
      )}

      {!loading && !error && history.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <FolderX size={30} />
          </span>
          <h3>Belum ada riwayat analisis</h3>
          <p>
            CV yang berhasil dianalisis akan muncul di sini. Mulai analisis
            pertama untuk melihat hasilnya.
          </p>
          <Button
            leadingIcon={<FilePlus2 size={17} />}
            onClick={onAnalyzeNew}
            type="button"
          >
            Analisis CV Pertama
          </Button>
        </div>
      ) : history.length > 0 ? (
        <>
          <div className={styles.historyTools}>
            <label className={styles.searchField}>
              <span>Cari berdasarkan nama file</span>
              <Input
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                placeholder="Cari nama CV..."
                startAdornment={<Search size={17} />}
                type="search"
                value={searchTerm}
              />
            </label>
            <label className={styles.filterField}>
              <span>Filter status</span>
              <Select
                onChange={(event) =>
                  setStatusFilter(toStatusFilter(event.currentTarget.value))
                }
                value={statusFilter}
              >
                <option value="ALL">Semua status</option>
                <option value="COMPLETED">Selesai</option>
                <option value="PROCESSING">Diproses</option>
                <option value="FAILED">Gagal</option>
              </Select>
            </label>
          </div>

          {filteredHistory.length === 0 ? (
            <div className={styles.noResults} role="status">
              Tidak ada riwayat yang cocok dengan pencarian atau filter.
            </div>
          ) : (
            <div className={styles.tableScroller}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th scope="col">Dokumen CV</th>
                    <th scope="col">Tanggal Analisis</th>
                    <th scope="col">Status</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((record) => (
                    <tr key={record.analysisId}>
                      <td>
                        <div className={styles.documentCell}>
                          <span className={styles.fileIcon} aria-hidden="true">
                            <FilePlus2 size={18} />
                          </span>
                          <span className={styles.documentCopy}>
                            <strong title={record.name}>{record.name}</strong>
                            <span>CV tersimpan</span>
                          </span>
                        </div>
                      </td>
                      <td>{formatCvDate(record.analyzedAt)}</td>
                      <td>
                        <Badge variant={statusVariant(record.status)}>
                          {statusLabel(record.status)}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          disabled={selectedAnalysisId === record.analysisId}
                          leadingIcon={
                            selectedAnalysisId === record.analysisId ? (
                              <LoaderCircle
                                className={styles.smallSpinner}
                                size={16}
                              />
                            ) : (
                              <Eye size={16} />
                            )
                          }
                          onClick={() => onOpenRecord(record)}
                          size="small"
                          type="button"
                          variant="ghost"
                        >
                          {selectedAnalysisId === record.analysisId
                            ? 'Memuat detail'
                            : 'Lihat hasil'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.tableActions}>
              <span>
                Halaman {page} dari {totalPages} · {total} analisis
              </span>
              <Button
                disabled={loading || page <= 1}
                leadingIcon={<ArrowLeft size={16} />}
                onClick={() => onPageChange(page - 1)}
                size="small"
                type="button"
                variant="outline"
              >
                Sebelumnya
              </Button>
              <Button
                disabled={loading || page >= totalPages}
                leadingIcon={<ArrowRight size={16} />}
                onClick={() => onPageChange(page + 1)}
                size="small"
                type="button"
                variant="outline"
              >
                Berikutnya
              </Button>
            </div>
          )}
        </>
      ) : null}
    </Card>
  )
}
