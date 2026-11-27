import {
  ArrowLeft,
  ClipboardList,
  Play,
  Search,
} from 'lucide-react'
import { Badge, Button, Card, Input, Select } from '../../../design-system/components'
import type {
  InterviewSession,
  InterviewSessionStatus,
} from '../types/interview'
import {
  formatInterviewDate,
  getAnsweredCount,
  getAverageScore,
  getSessionStatusLabel,
} from '../utils/interviewFormatters'
import styles from '../pages/InterviewPage.module.css'

type StatusFilter = 'ALL' | InterviewSessionStatus

interface InterviewHistoryViewProps {
  sessions: InterviewSession[]
  searchTerm: string
  statusFilter: StatusFilter
  isLoading: boolean
  errorMessage: string
  detailErrorMessage: string
  loadingSessionId: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  } | null
  onSearchChange(value: string): void
  onStatusChange(value: StatusFilter): void
  onNewSession(): void
  onOpenSession(session: InterviewSession): void
  onRetryList(): void
  onRetryDetail(): void
  onPageChange(page: number): void
}

function statusVariant(status: InterviewSessionStatus) {
  if (status === 'IN_PROGRESS') return 'info'
  if (status === 'COMPLETED') return 'success'
  return 'neutral'
}

function toStatusFilter(value: string): StatusFilter {
  if (
    value === 'IN_PROGRESS' ||
    value === 'COMPLETED' ||
    value === 'CANCELLED'
  ) {
    return value
  }
  return 'ALL'
}

export function InterviewHistoryView({
  sessions,
  searchTerm,
  statusFilter,
  isLoading,
  errorMessage,
  detailErrorMessage,
  loadingSessionId,
  pagination,
  onSearchChange,
  onStatusChange,
  onNewSession,
  onOpenSession,
  onRetryList,
  onRetryDetail,
  onPageChange,
}: InterviewHistoryViewProps) {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('id-ID')
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      `${session.context.title} ${session.context.company ?? ''}`
        .toLocaleLowerCase('id-ID')
        .includes(normalizedSearch)
    return (
      matchesSearch &&
      (statusFilter === 'ALL' || session.status === statusFilter)
    )
  })

  return (
    <Card className={styles.historyCard}>
      <header className={styles.historyHeader}>
        <div>
          <span className={styles.eyebrow}>Latihan wawancara</span>
          <h2>Semua Sesi Latihan</h2>
          <p>Riwayat dan progres diambil dari sesi yang tersimpan di backend.</p>
        </div>
        <Button onClick={onNewSession} type="button">
          Mulai Sesi Baru
        </Button>
      </header>

      {isLoading && (
        <p className={styles.evaluationLoading} role="status">
          Memuat riwayat sesi...
        </p>
      )}
      {errorMessage && (
        <div className={styles.errorMessage} role="alert">
          {errorMessage}
          <Button onClick={onRetryList} size="small" type="button" variant="outline">
            Coba muat ulang
          </Button>
        </div>
      )}
      {detailErrorMessage && (
        <div className={styles.errorMessage} role="alert">
          {detailErrorMessage}
          <Button
            onClick={onRetryDetail}
            size="small"
            type="button"
            variant="outline"
          >
            Coba buka kembali
          </Button>
        </div>
      )}

      {!isLoading && !errorMessage && sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <ClipboardList size={29} />
          </span>
          <h3>Belum ada sesi latihan</h3>
          <p>Mulai sesi pertama untuk mencoba latihan wawancara berbasis teks atau suara.</p>
          <Button onClick={onNewSession} type="button">
            Mulai Sesi Pertama
          </Button>
        </div>
      ) : isLoading || errorMessage ? null : (
        <>
          <div className={styles.historyTools}>
            <label className={styles.searchField}>
              <span>Cari posisi atau perusahaan</span>
              <Input
                aria-label="Cari posisi atau perusahaan"
                onChange={(event) => onSearchChange(event.currentTarget.value)}
                placeholder="Cari posisi atau perusahaan..."
                startAdornment={<Search size={17} />}
                type="search"
                value={searchTerm}
              />
            </label>
            <label className={styles.filterField}>
              <span>Filter status</span>
              <Select
                onChange={(event) =>
                  onStatusChange(toStatusFilter(event.currentTarget.value))
                }
                value={statusFilter}
              >
                <option value="ALL">Semua status</option>
                <option value="IN_PROGRESS">Berlangsung</option>
                <option value="COMPLETED">Selesai</option>
                <option value="CANCELLED">Dibatalkan</option>
              </Select>
            </label>
          </div>

          {filteredSessions.length === 0 ? (
            <div className={styles.noResults} role="status">
              {sessions.length === 0
                ? 'Tidak ada sesi pada halaman ini.'
                : 'Tidak ada sesi yang cocok dengan pencarian atau filter.'}
            </div>
          ) : (
            <div className={styles.tableScroller}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th scope="col">Konteks Pekerjaan</th>
                    <th scope="col">Tanggal</th>
                    <th scope="col">Pertanyaan</th>
                    <th scope="col">Rata-rata Skor</th>
                    <th scope="col">Status</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session) => {
                    const averageScore = getAverageScore(session)
                    const isOpening = loadingSessionId === session.id
                    return (
                      <tr key={session.id}>
                        <td>
                          <span className={styles.documentCopy}>
                            <strong title={session.context.title}>
                              {session.context.title}
                            </strong>
                            {session.context.company && (
                              <span>{session.context.company}</span>
                            )}
                          </span>
                        </td>
                        <td>{formatInterviewDate(session.startedAt)}</td>
                        <td>
                          {getAnsweredCount(session.questions)}/
                          {session.questions.length} dijawab
                        </td>
                        <td>
                          {averageScore === null
                            ? 'Tanpa Skor'
                            : `${averageScore}/100`}
                        </td>
                        <td>
                          <Badge variant={statusVariant(session.status)}>
                            {getSessionStatusLabel(session.status)}
                          </Badge>
                        </td>
                        <td>
                          <div className={styles.tableActions}>
                            <Button
                              disabled={Boolean(loadingSessionId)}
                              leadingIcon={
                                session.status === 'IN_PROGRESS' ? (
                                  <Play size={15} />
                                ) : (
                                  <ArrowLeft size={15} />
                                )
                              }
                              onClick={() => onOpenSession(session)}
                              size="small"
                              type="button"
                              variant={
                                session.status === 'IN_PROGRESS'
                                  ? 'primary'
                                  : 'outline'
                              }
                            >
                              {isOpening
                                ? 'Memuat...'
                                : session.status === 'IN_PROGRESS'
                                  ? 'Lanjutkan'
                                  : 'Ringkasan'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className={styles.historyPagination}>
              <span>
                Halaman {pagination.page} dari {pagination.totalPages} ·{' '}
                {pagination.total} sesi
              </span>
              <div>
                <Button
                  disabled={isLoading || pagination.page <= 1}
                  onClick={() => onPageChange(pagination.page - 1)}
                  size="small"
                  type="button"
                  variant="outline"
                >
                  Sebelumnya
                </Button>
                <Button
                  disabled={
                    isLoading || pagination.page >= pagination.totalPages
                  }
                  onClick={() => onPageChange(pagination.page + 1)}
                  size="small"
                  type="button"
                  variant="outline"
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
