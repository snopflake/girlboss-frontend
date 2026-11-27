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
  const summary = session.summary

  return (
    <div className={styles.summaryPage}>
      <header className={styles.summaryBanner}>
        <div>
          <Badge variant="success">Hasil dari backend</Badge>
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
            {summary?.answeredQuestions ?? answeredCount} /{' '}
            {summary?.totalQuestions ?? session.questions.length}
          </strong>
        </Card>
        <Card className={styles.summaryStat}>
          <span>Rata-rata skor</span>
          <strong>
            {summary ? `${summary.averageScore}/100` : 'Belum tersedia'}
          </strong>
        </Card>
      </div>

      <Card className={styles.summaryDetails}>
        <header className={styles.sectionTitle}>
          <div>
            <h3>Rincian Jawaban</h3>
            <p>Jawaban dan evaluasi yang berhasil disimpan oleh backend.</p>
          </div>
          <Badge variant="neutral">Evaluasi Gemini</Badge>
        </header>
        {summary && (
          <>
            <div className={styles.feedbackGrid}>
              <div>
                <h4>Relevansi</h4>
                <p>
                  {summary.dimensionAverages.relevance.toLocaleString('id-ID', {
                    maximumFractionDigits: 1,
                  })}
                  /5
                </p>
              </div>
              <div>
                <h4>Kejelasan</h4>
                <p>
                  {summary.dimensionAverages.clarity.toLocaleString('id-ID', {
                    maximumFractionDigits: 1,
                  })}
                  /5
                </p>
              </div>
              <div>
                <h4>Kelengkapan</h4>
                <p>
                  {summary.dimensionAverages.completeness.toLocaleString('id-ID', {
                    maximumFractionDigits: 1,
                  })}
                  /5
                </p>
              </div>
              <div>
                <h4>Penyampaian</h4>
                <p>
                  {summary.dimensionAverages.delivery.toLocaleString('id-ID', {
                    maximumFractionDigits: 1,
                  })}
                  /5
                </p>
              </div>
            </div>
          </>
        )}
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
                      {question.feedback.delivery && (
                        <div>
                          <dt>Penyampaian</dt>
                          <dd>{question.feedback.delivery}</dd>
                        </div>
                      )}
                      {question.feedback.overallFeedback && (
                        <div>
                          <dt>Ringkasan</dt>
                          <dd>{question.feedback.overallFeedback}</dd>
                        </div>
                      )}
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
          {summary?.improvementTips.length ? (
            <ul className={styles.howSteps}>
              {summary.improvementTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          ) : (
            <p>Rekomendasi lanjutan belum tersedia dari backend.</p>
          )}
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
