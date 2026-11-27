import {
  AlertTriangle,
  Check,
  Circle,
  Clock3,
  LoaderCircle,
  ListChecks,
  Send,
  SkipForward,
  X,
} from 'lucide-react'
import { Badge, Button, Card, Textarea } from '../../../design-system/components'
import type {
  InterviewQuestion,
  InterviewSession,
  InterviewStage,
} from '../types/interview'
import {
  formatInterviewDuration,
  getAnsweredCount,
} from '../utils/interviewFormatters'
import styles from '../pages/InterviewPage.module.css'

interface InterviewSessionViewProps {
  session: InterviewSession
  question: InterviewQuestion | null
  questionIndex: number
  stage: InterviewStage
  elapsedSeconds: number
  isSubmitting: boolean
  submissionError: string
  onAnswerChange(value: string): void
  onSubmit(): void
  onSkip(): void
  onNext(): void
  onReturnToUnanswered(): void
  onRetryEvaluation(): void
  onEnd(): void
}

function progressStatusLabel(status: InterviewQuestion['status']) {
  if (status === 'ANSWERED') return 'Dijawab'
  if (status === 'SKIPPED') return 'Dilewati'
  return 'Belum dijawab'
}

export function InterviewSessionView({
  session,
  question,
  questionIndex,
  stage,
  elapsedSeconds,
  isSubmitting,
  submissionError,
  onAnswerChange,
  onSubmit,
  onSkip,
  onNext,
  onReturnToUnanswered,
  onRetryEvaluation,
  onEnd,
}: InterviewSessionViewProps) {
  const answeredCount = getAnsweredCount(session.questions)
  const isLastQuestion = questionIndex === session.questions.length - 1
  const canComplete = answeredCount === session.questions.length

  return (
    <div className={styles.interviewScreen}>
      <header className={styles.sessionHeader}>
        <div className={styles.sessionTitle}>
          <span className={styles.eyebrow}>Sesi latihan teks</span>
          <h2>{session.context.title}</h2>
          <p>
            {session.context.company} · {session.context.employmentType}
          </p>
        </div>
        <div className={styles.sessionHeaderActions}>
          <Badge variant="info">Berlangsung</Badge>
          <span className={styles.sessionTimer} role="timer">
            <Clock3 size={16} aria-hidden="true" />
            {formatInterviewDuration(elapsedSeconds)}
          </span>
          <Button
            leadingIcon={<X size={16} />}
            disabled={!canComplete || isSubmitting}
            onClick={onEnd}
            size="small"
            type="button"
            variant="outline"
          >
            Akhiri Sesi
          </Button>
        </div>
      </header>

      <div className={styles.sessionGrid}>
        <main className={styles.sessionMain}>
          {question ? (
            <Card className={styles.questionCard}>
              <div className={styles.questionMeta}>
                <Badge variant="primary">{question.category}</Badge>
                <span>
                  Pertanyaan {questionIndex + 1} dari {session.questions.length}
                </span>
              </div>
              <div className={styles.questionBody}>
                <span className={styles.questionNumber}>
                  {String(questionIndex + 1).padStart(2, '0')}
                </span>
                <h3>{question.prompt}</h3>
              </div>
            </Card>
          ) : (
            <Card className={styles.completeCard}>
              <span className={styles.successIcon} aria-hidden="true">
                <Check size={24} />
              </span>
              <h3>Semua Pertanyaan Telah Ditinjau</h3>
              <p>
                Kamu menjawab {answeredCount} dari {session.questions.length}{' '}
                pertanyaan. Akhiri sesi untuk melihat ringkasan.
              </p>
              <Button disabled={!canComplete} onClick={onEnd} type="button">
                Akhiri Sesi
              </Button>
            </Card>
          )}

          {question && stage === 'complete' && (
            <Card className={styles.completeCard}>
              <span className={styles.successIcon} aria-hidden="true">
                <Check size={24} />
              </span>
              <h3>Semua Pertanyaan Telah Ditinjau</h3>
              {canComplete ? (
                <>
                  <p>
                    Semua jawaban dan evaluasi sudah tersimpan. Selesaikan sesi
                    untuk melihat ringkasan dari backend.
                  </p>
                  <Button onClick={onEnd} type="button">
                    Selesaikan Sesi
                  </Button>
                </>
              ) : (
                <>
                  <p>
                    Kamu menjawab {answeredCount} dari {session.questions.length}{' '}
                    pertanyaan. Jawab pertanyaan yang tersisa sebelum sesi
                    diselesaikan.
                  </p>
                  <Button onClick={onReturnToUnanswered} type="button">
                    Kembali ke pertanyaan yang belum dijawab
                  </Button>
                </>
              )}
            </Card>
          )}

          {question && (stage === 'answering' || stage === 'evaluating') && (
            <Card className={styles.answerCard}>
              <div className={styles.sectionTitle}>
                <h3>Jawaban Kamu</h3>
                <span>Maksimum 2.000 karakter</span>
              </div>
              <label className={styles.visuallyHidden} htmlFor="interview-answer">
                Jawaban Kamu
              </label>
              <Textarea
                id="interview-answer"
                maxLength={2000}
                disabled={isSubmitting}
                onChange={(event) => onAnswerChange(event.currentTarget.value)}
                placeholder="Tuliskan jawabanmu di sini..."
                rows={7}
                value={question.answer}
              />
              <div className={styles.answerMeta}>
                <span className={styles.draftNote}>
                  Draf tersimpan sementara selama sesi ini saja.
                </span>
                <span
                  aria-live="polite"
                  className={
                    question.answer.length >= 1900 ? styles.counterNearLimit : ''
                  }
                >
                  {question.answer.length}/2000
                </span>
              </div>
              <Card className={styles.starGuide} padding="compact">
                <div className={styles.sectionTitle}>
                  <h4>Panduan metode STAR</h4>
                  <span>Susun jawaban lebih terarah</span>
                </div>
                <div className={styles.starItems}>
                  <span>
                    <strong>S</strong>ituasi
                  </span>
                  <span>
                    <strong>T</strong>ugas
                  </span>
                  <span>
                    <strong>A</strong>ksi
                  </span>
                  <span>
                    <strong>R</strong>esult
                  </span>
                </div>
              </Card>
              <div className={styles.answerActions}>
                <Button
                  disabled={!question.answer.trim() || isSubmitting}
                  leadingIcon={<Send size={16} />}
                  onClick={onSubmit}
                  type="button"
                >
                  Kirim Jawaban
                </Button>
                <Button
                  disabled={isSubmitting}
                  leadingIcon={<SkipForward size={16} />}
                  onClick={onSkip}
                  type="button"
                  variant="outline"
                >
                  Lewati Pertanyaan
                </Button>
              </div>
              {stage === 'evaluating' && (
                <div className={styles.evaluationLoading} role="status">
                  <LoaderCircle
                    className={styles.smallSpinner}
                    size={18}
                    aria-hidden="true"
                  />
                  Gemini sedang mengevaluasi jawaban...
                </div>
              )}
            </Card>
          )}

          {question &&
            stage !== 'answering' &&
            stage !== 'evaluating' &&
            stage !== 'complete' && (
            <Card className={styles.submittedAnswerCard}>
              <div className={styles.submittedHeading}>
                <h3>Jawaban Kamu</h3>
                <Badge variant={stage === 'evaluation-error' ? 'danger' : 'success'}>
                  {stage === 'evaluation-error'
                    ? 'Evaluasi gagal'
                    : 'Jawaban berhasil dikirim'}
                </Badge>
              </div>
              <p className={styles.answerText}>
                {question.answer || 'Belum ada jawaban untuk pertanyaan ini.'}
              </p>
              {stage === 'evaluation-error' && (
                <div className={styles.errorMessage} role="alert">
                  <AlertTriangle size={18} aria-hidden="true" />
                  {submissionError}
                  <Button
                    disabled={isSubmitting}
                    onClick={onRetryEvaluation}
                    size="small"
                    type="button"
                  >
                    Cek status &amp; coba lagi
                  </Button>
                </div>
              )}
              {stage === 'feedback' && question.feedback && (
                <div className={styles.feedbackPanel}>
                  <div className={styles.feedbackHeader}>
                    <h3>Hasil Evaluasi</h3>
                    {question.feedback.score !== undefined && (
                      <Badge variant="success">
                        Skor AI: {question.feedback.score}/100
                      </Badge>
                    )}
                  </div>
                  <div className={styles.feedbackGrid}>
                    <div>
                      <h4>
                        Relevansi
                        {question.feedback.dimensionScores &&
                          ` · ${question.feedback.dimensionScores.relevance}/5`}
                      </h4>
                      <p>{question.feedback.relevance}</p>
                    </div>
                    <div>
                      <h4>
                        Kejelasan
                        {question.feedback.dimensionScores &&
                          ` · ${question.feedback.dimensionScores.clarity}/5`}
                      </h4>
                      <p>{question.feedback.clarity}</p>
                    </div>
                    <div>
                      <h4>
                        Kelengkapan
                        {question.feedback.dimensionScores &&
                          ` · ${question.feedback.dimensionScores.completeness}/5`}
                      </h4>
                      <p>{question.feedback.completeness}</p>
                    </div>
                    {question.feedback.delivery && (
                      <div>
                        <h4>
                          Penyampaian
                          {question.feedback.dimensionScores &&
                            ` · ${question.feedback.dimensionScores.delivery}/5`}
                        </h4>
                        <p>{question.feedback.delivery}</p>
                      </div>
                    )}
                  </div>
                  {question.feedback.overallFeedback && (
                    <div className={styles.recommendation}>
                      <strong>Ringkasan Evaluasi</strong>
                      <p>{question.feedback.overallFeedback}</p>
                    </div>
                  )}
                  <div className={styles.recommendation}>
                    <strong>Saran Perbaikan</strong>
                    <p>{question.feedback.recommendation}</p>
                  </div>
                  <div className={styles.answerActions}>
                    <Button onClick={onNext} type="button">
                      {isLastQuestion ? 'Selesaikan Pertanyaan' : 'Pertanyaan Berikutnya'}
                    </Button>
                  </div>
                  {isLastQuestion && (
                    <p className={styles.fieldHint}>
                      Setelah ini, akhiri sesi untuk membuka ringkasan.
                    </p>
                  )}
                </div>
              )}
            </Card>
          )}
        </main>

        <aside className={styles.sessionSidebar}>
          <Card className={styles.progressCard} padding="compact">
            <div className={styles.sidebarHeading}>
              <span className={styles.sidebarIcon} aria-hidden="true">
                <ListChecks size={18} />
              </span>
              <h3>Progres Sesi</h3>
            </div>
            <div
              aria-label={`${answeredCount} dari ${session.questions.length} pertanyaan dijawab`}
              className={styles.questionProgressTrack}
              role="progressbar"
              aria-valuemax={session.questions.length}
              aria-valuemin={0}
              aria-valuenow={answeredCount}
            >
              <span
                style={{
                  width: `${(answeredCount / session.questions.length) * 100}%`,
                }}
              />
            </div>
            <p className={styles.progressSummary}>
              {answeredCount} dari {session.questions.length} dijawab
            </p>
            <ol className={styles.questionStatusList}>
              {session.questions.map((item, index) => (
                <li
                  className={[
                    styles.questionStatus,
                    question?.id === item.id ? styles.currentQuestion : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={item.id}
                >
                  <span aria-hidden="true">
                    {item.status === 'ANSWERED' ? (
                      <Check size={16} />
                    ) : item.status === 'SKIPPED' ? (
                      <SkipForward size={16} />
                    ) : question?.id === item.id ? (
                      <LoaderCircle
                        className={styles.smallSpinner}
                        size={16}
                      />
                    ) : (
                      <Circle size={16} />
                    )}
                  </span>
                  <span>
                    <strong>Pertanyaan {index + 1}</strong>
                    <small>{progressStatusLabel(item.status)}</small>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
          <Card className={styles.progressCard} padding="compact">
            <p className={styles.sidebarDescription}>
              Jawaban dikirim ke backend untuk dievaluasi oleh Gemini. Kamu
              tidak dapat mengirim jawaban yang sama lebih dari sekali.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  )
}


