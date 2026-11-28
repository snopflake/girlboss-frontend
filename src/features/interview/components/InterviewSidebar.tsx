import { ArrowRight, Clock3, ListChecks, Sparkles } from 'lucide-react'
import { Badge, Button, Card } from '../../../design-system/components'
import type { InterviewSession } from '../types/interview'
import {
  formatInterviewDate,
  getSessionStatusLabel,
} from '../utils/interviewFormatters'
import styles from '../pages/InterviewPage.module.css'

interface InterviewSidebarProps {
  sessions: InterviewSession[]
  isLoading: boolean
  errorMessage: string
  detailErrorMessage: string
  onRetry(): void
  onRetryDetail(): void
  onOpenHistory(): void
  onSelectSession(session: InterviewSession): void
  loadingSessionId: string | null
}

function statusVariant(status: InterviewSession['status']) {
  if (status === 'IN_PROGRESS') return 'info'
  if (status === 'COMPLETED') return 'success'
  return 'neutral'
}

export function InterviewSidebar({
  sessions,
  isLoading,
  errorMessage,
  detailErrorMessage,
  onRetry,
  onRetryDetail,
  onOpenHistory,
  onSelectSession,
  loadingSessionId,
}: InterviewSidebarProps) {
  const recentSessions = sessions.slice(0, 3)

  return (
    <aside className={styles.sidebar}>
      <Card className={styles.sidebarCard} padding="compact">
        <div className={styles.sidebarHeading}>
          <span className={styles.sidebarIcon} aria-hidden="true">
            <ListChecks size={18} />
          </span>
          <h2>Cara Kerja</h2>
        </div>
        <ol className={styles.howSteps}>
          <li>Pilih konteks pekerjaan atau isi secara manual.</li>
          <li>Jawab pertanyaan latihan dengan metode STAR.</li>
          <li>Tinjau masukan Gemini dan ringkasan sesi.</li>
        </ol>
      </Card>

      <Card className={styles.sidebarCard} padding="compact">
        <div className={styles.sidebarHeading}>
          <span className={styles.sidebarIcon} aria-hidden="true">
            <Clock3 size={18} />
          </span>
          <h2>Riwayat Sesi</h2>
        </div>
        {isLoading && (
          <p className={styles.sidebarDescription} role="status">
            Memuat riwayat...
          </p>
        )}
        {errorMessage && (
          <div className={styles.sidebarDescription} role="alert">
            {errorMessage}
            <Button onClick={onRetry} size="small" type="button" variant="outline">
              Coba lagi
            </Button>
          </div>
        )}
        {detailErrorMessage && (
          <div className={styles.sidebarDescription} role="alert">
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
        {!isLoading && !errorMessage && recentSessions.length === 0 ? (
          <p className={styles.sidebarDescription}>Belum ada sesi latihan.</p>
        ) : !errorMessage && (
          <ul className={styles.recentSessions}>
            {recentSessions.map((session) => (
              <li key={session.id}>
                <button
                  className={styles.recentSession}
                  onClick={() => onSelectSession(session)}
                  type="button"
                  disabled={Boolean(loadingSessionId)}
                >
                  <span className={styles.recentSessionTitle}>
                    {session.context.title}
                  </span>
                  <span className={styles.recentSessionMeta}>
                    <span>{formatInterviewDate(session.startedAt)}</span>
                    <Badge variant={statusVariant(session.status)}>
                      {getSessionStatusLabel(session.status)}
                    </Badge>
                  </span>
                  {loadingSessionId === session.id && (
                    <span className={styles.fieldHint}>Memuat detail...</span>
                  )}
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
          Lihat semua sesi <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </Card>

      <Card className={styles.sidebarCard} padding="compact">
        <div className={styles.sidebarHeading}>
          <span className={styles.sidebarIcon} aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <h2>Tentang Evaluasi AI</h2>
        </div>
        <Badge className={styles.localBadge} variant="primary">
          Evaluasi Gemini
        </Badge>
        <p className={styles.sidebarDescription}>
          Jawaban teks atau rekaman suara dikirim ke backend untuk dievaluasi.
          Transkrip dan metrik suara hanya ditampilkan jika tersedia dari backend.
        </p>
      </Card>
    </aside>
  )
}
