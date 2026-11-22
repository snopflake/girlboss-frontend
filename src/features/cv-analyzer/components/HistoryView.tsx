import { Eye, FilePlus2, FolderX, RotateCcw, Search } from 'lucide-react'
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
import { formatCvDate, formatCvFileSize } from '../utils/cvFormatters'
import styles from '../pages/CvAnalyzerPage.module.css'

type StatusFilter = 'ALL' | AnalysisStatus

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

interface HistoryViewProps {
  history: AnalysisRecord[]
  searchTerm: string
  statusFilter: StatusFilter
  onSearchTermChange(value: string): void
  onStatusFilterChange(value: StatusFilter): void
  onAnalyzeNew(): void
  onOpenRecord(record: AnalysisRecord): void
  onRetry(record: AnalysisRecord): void
  onClearDemoHistory(): void
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
  searchTerm,
  statusFilter,
  onSearchTermChange,
  onStatusFilterChange,
  onAnalyzeNew,
  onOpenRecord,
  onRetry,
  onClearDemoHistory,
}: HistoryViewProps) {
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
          <p>Daftar ini hanya tersimpan sementara sebagai data simulasi.</p>
        </div>
        <Button
          leadingIcon={<FilePlus2 size={17} />}
          onClick={onAnalyzeNew}
          type="button"
        >
          Analisis CV Baru
        </Button>
      </header>

      {history.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <FolderX size={30} />
          </span>
          <h3>Belum ada riwayat analisis</h3>
          <p>
            CV yang dianalisis akan muncul di sini. Mulai analisis pertama
            untuk melihat hasilnya.
          </p>
          <Button
            leadingIcon={<FilePlus2 size={17} />}
            onClick={onAnalyzeNew}
            type="button"
          >
            Analisis CV Pertama
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.historyTools}>
            <label className={styles.searchField}>
              <span>Cari berdasarkan nama file</span>
              <Input
                onChange={(event) => onSearchTermChange(event.currentTarget.value)}
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
                  onStatusFilterChange(toStatusFilter(event.currentTarget.value))
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
                            <span>
                              {record.format} · {formatCvFileSize(record.size)}
                            </span>
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
                        <div className={styles.tableActions}>
                          <Button
                            leadingIcon={<Eye size={16} />}
                            onClick={() => onOpenRecord(record)}
                            size="small"
                            type="button"
                            variant="ghost"
                          >
                            Lihat hasil
                          </Button>
                          <Button
                            aria-label={`Analisis ulang ${record.name}`}
                            leadingIcon={<RotateCcw size={16} />}
                            onClick={() => onRetry(record)}
                            size="small"
                            type="button"
                            variant="outline"
                          >
                            Ulangi
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.demoHistoryFooter}>
            <Badge variant="neutral">Data demo lokal</Badge>
            <Button
              onClick={onClearDemoHistory}
              size="small"
              type="button"
              variant="ghost"
            >
              Kosongkan data demo
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}
