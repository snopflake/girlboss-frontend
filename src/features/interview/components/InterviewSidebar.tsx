import { ArrowRight, Clock3, ListChecks, Sparkles } from 'lucide-react'
import { Badge, Button, Card, Select } from '../../../design-system/components'
import type {
  DemoFailureMode,
  InterviewSession,
} from '../types/interview'
import {
  formatInterviewDate,
  getSessionStatusLabel,
} from '../utils/interviewFormatters'
import styles from '../pages/InterviewPage.module.css'

interface InterviewSidebarProps {
  sessions: InterviewSession[]
  demoFailureMode: DemoFailureMode
  onDemoFailureModeChange(value: DemoFailureMode): void
  onOpenHistory(): void
  onResume(session: InterviewSession): void
}

function statusVariant(status: InterviewSession['status']) {
  if (status === 'IN_PROGRESS') return 'info'
  if (status === 'COMPLETED') return 'success'
  return 'neutral'
}

export function InterviewSidebar({
  sessions,
  demoFailureMode,
  onDemoFailureModeChange,
  onOpenHistory,
  onResume,
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
          <li>Tinjau masukan simulasi dan rangkuman sesi.</li>
        </ol>
      </Card>

      <Card className={styles.sidebarCard} padding="compact">
        <div className={styles.sidebarHeading}>
          <span className={styles.sidebarIcon} aria-hidden="true">
            <Clock3 size={18} />
          </span>
          <h2>Riwayat Sesi</h2>
        </div>
        {recentSessions.length === 0 ? (
          <p className={styles.sidebarDescription}>Belum ada sesi latihan.</p>
        ) : (
          <ul className={styles.recentSessions}>
            {recentSessions.map((session) => (
              <li key={session.id}>
                <button
                  className={styles.recentSession}
                  onClick={() =>
                    session.status === 'IN_PROGRESS' && onResume(session)
                  }
                  type="button"
                  disabled={session.status !== 'IN_PROGRESS'}
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
          Simulasi lokal
        </Badge>
        <p className={styles.sidebarDescription}>
          Pertanyaan dan evaluasi ini adalah contoh UI. Jawaban hanya berada di
          memori sesi dan tidak dikirim ke layanan AI.
        </p>
        <div className={styles.demoControl}>
          <label htmlFor="demo-failure-mode">Skenario demo</label>
          <Select
            id="demo-failure-mode"
            onChange={(event) => {
              const value = event.currentTarget.value
              onDemoFailureModeChange(
                value === 'PREPARATION' || value === 'EVALUATION'
                  ? value
                  : 'NONE',
              )
            }}
            value={demoFailureMode}
          >
            <option value="NONE">Berjalan normal</option>
            <option value="PREPARATION">Tampilkan gagal menyiapkan</option>
            <option value="EVALUATION">Tampilkan gagal evaluasi</option>
          </Select>
        </div>
      </Card>
    </aside>
  )
}
