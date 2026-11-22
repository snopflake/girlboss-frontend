import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileSearch,
  RotateCcw,
} from 'lucide-react'
import { Link } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import { Badge, Button, Card } from '../../../design-system/components'
import type { InterviewQuestion, InterviewSession } from '../types/interview'
import {
  formatInterviewDate,
  formatInterviewDuration,
  getAnsweredCount,
  getAverageScore,
} from '../utils/interviewFormatters'
import styles from '../pages/InterviewPage.module.css'

interface InterviewSummaryViewProps {
  session: InterviewSession
  onNewSession(): void
  onOpenHistory(): void
}

function questionStatusLabel(question: InterviewQuestion) {
  if (question.status === 'ANSWERED') return 'Dijawab'
  if (question.status === 'SKIPPED') return 'Dilewati'
  return 'Belum dijawab'
}

export function InterviewSummaryView({
  session,
  onNewSession,
  onOpenHistory,
}: InterviewSummaryViewProps) {
  const answeredCount = getAnsweredCount(session.questions)
  const averageScore = getAverageScore(session)

  return (
    <div className={styles.summaryPage}>
      <header className={styles.summaryBanner}>
        <div>
          <Badge variant="neutral">Latihan simulasi</Badge>
          <h2>
            {session.status === 'CANCELLED'
              ? 'Ringkasan Sesi Dibatalkan'
              : 'Sesi Latihan Selesai'}
          </h2>
          <p>
            {session.context.title} · {session.context.company}
          </p>
          <span>
            <CalendarDays size={15} aria-hidden="true" />
            {formatInterviewDate(session.startedAt)}
          </span>
        </div>
        <span className={styles.summaryIcon} aria-hidden="true">
          <FileSearch size={30} />
        </span>
      </header>

      <div className={styles.summaryStats}>
        <Card className={styles.summaryStat}>
          <span>Durasi sesi</span>
          <strong>
            <Clock3 size={17} aria-hidden="true" />
            {formatInterviewDuration(session.elapsedSeconds)}
          </strong>
        </Card>
        <Card className={styles.summaryStat}>
          <span>Pertanyaan dijawab</span>
          <strong>
            {answeredCount} / {session.questions.length}
          </strong>
        </Card>
        <Card className={styles.summaryStat}>
          <span>Rata-rata skor</span>
          <strong>{averageScore === null ? 'Tanpa Skor' : `${averageScore}/100`}</strong>
        </Card>
      </div>

      <Card className={styles.summaryDetails}>
        <header className={styles.sectionTitle}>
          <div>
            <h3>Rincian Jawaban</h3>
            <p>Jawaban dan evaluasi tersimpan sementara di sesi ini.</p>
          </div>
          <Badge variant="neutral">Feedback kualitatif</Badge>
        </header>
        <div className={styles.accordionList}>
          {session.questions.map((question, index) => (
            <details className={styles.answerAccordion} key={question.id}>
              <summary>
                <span>
                  <strong>Pertanyaan {index + 1}</strong>
                  <small>{question.prompt}</small>
                </span>
                <Badge
                  variant={
                    question.status === 'ANSWERED'
                      ? 'success'
                      : question.status === 'SKIPPED'
                        ? 'warning'
                        : 'neutral'
                  }
                >
                  {questionStatusLabel(question)}
                </Badge>
              </summary>
              <div className={styles.accordionContent}>
                <h4>Jawaban Kamu</h4>
                <p>{question.answer.trim() || 'Tidak ada jawaban untuk pertanyaan ini.'}</p>
                {question.feedback ? (
                  <>
                    <h4>Feedback Evaluasi</h4>
                    <dl className={styles.summaryFeedback}>
                      <div>
                        <dt>Relevansi</dt>
                        <dd>{question.feedback.relevance}</dd>
                      </div>
                      <div>
                        <dt>Kejelasan</dt>
                        <dd>{question.feedback.clarity}</dd>
                      </div>
                      <div>
                        <dt>Kelengkapan</dt>
                        <dd>{question.feedback.completeness}</dd>
                      </div>
                      <div>
                        <dt>Rekomendasi</dt>
                        <dd>{question.feedback.recommendation}</dd>
                      </div>
                    </dl>
                    {question.feedback.score !== undefined && (
                      <p className={styles.optionalScore}>
                        Skor: {question.feedback.score}/100
                      </p>
                    )}
                  </>
                ) : (
                  <p className={styles.mutedText}>
                    Belum ada feedback evaluasi untuk pertanyaan ini.
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </Card>

      <Card className={styles.nextFocus}>
        <span className={styles.sidebarIcon} aria-hidden="true">
          <RotateCcw size={19} />
        </span>
        <div>
          <h3>Fokus Latihan Berikutnya</h3>
          <p>
            Latih jawaban dengan metode STAR dan sertakan hasil yang terukur
            untuk memperjelas dampak pengalamanmu.
          </p>
        </div>
      </Card>

      <div className={styles.summaryActions}>
        <Button onClick={onNewSession} type="button">
          Mulai Sesi Baru
        </Button>
        <Link className={styles.actionLink} to={routePaths.applicant.cvAnalyzer}>
          <FileSearch size={17} aria-hidden="true" />
          Analisis CV Saya
        </Link>
        <Button
          leadingIcon={<ArrowLeft size={17} />}
          onClick={onOpenHistory}
          type="button"
          variant="outline"
        >
          Kembali ke Riwayat
        </Button>
      </div>
    </div>
  )
}
