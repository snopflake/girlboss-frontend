import {
  ArrowLeft,
  ClipboardList,
  Play,
  Search,
  Trash2,
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
  onSearchChange(value: string): void
  onStatusChange(value: StatusFilter): void
  onNewSession(): void
  onOpenSession(session: InterviewSession): void
  onResumeSession(session: InterviewSession): void
  onClearDemoHistory(): void
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
  onSearchChange,
  onStatusChange,
  onNewSession,
  onOpenSession,
  onResumeSession,
  onClearDemoHistory,
}: InterviewHistoryViewProps) {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('id-ID')
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      `${session.context.title} ${session.context.company}`
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
          <p>Riwayat di halaman ini merupakan data contoh lokal.</p>
        </div>
        <Button onClick={onNewSession} type="button">
          Mulai Sesi Baru
        </Button>
      </header>

      {sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <ClipboardList size={29} />
          </span>
          <h3>Belum ada sesi latihan</h3>
          <p>Mulai sesi pertama untuk mencoba latihan wawancara berbasis teks.</p>
          <Button onClick={onNewSession} type="button">
            Mulai Sesi Pertama
          </Button>
        </div>
      ) : (
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
              Tidak ada sesi yang cocok dengan pencarian atau filter.
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
                    return (
                      <tr key={session.id}>
                        <td>
                          <span className={styles.documentCopy}>
                            <strong title={session.context.title}>
                              {session.context.title}
                            </strong>
                            <span>{session.context.company}</span>
                          </span>
                        </td>
                        <td>{formatInterviewDate(session.startedAt)}</td>
                        <td>
                          {getAnsweredCount(session.questions)}/
                          {session.questions.length} dijawab
                        </td>
                        <td>{averageScore === null ? 'Tanpa Skor' : `${averageScore}/100`}</td>
                        <td>
                          <Badge variant={statusVariant(session.status)}>
                            {getSessionStatusLabel(session.status)}
                          </Badge>
                        </td>
                        <td>
                          <div className={styles.tableActions}>
                            {session.status === 'IN_PROGRESS' ? (
                              <Button
                                leadingIcon={<Play size={15} />}
                                onClick={() => onResumeSession(session)}
                                size="small"
                                type="button"
                              >
                                Lanjutkan
                              </Button>
                            ) : (
                              <Button
                                leadingIcon={<ArrowLeft size={15} />}
                                onClick={() => onOpenSession(session)}
                                size="small"
                                type="button"
                                variant="outline"
                              >
                                Ringkasan
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className={styles.demoHistoryFooter}>
            <Badge variant="neutral">Data demo lokal</Badge>
            <Button
              leadingIcon={<Trash2 size={15} />}
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
