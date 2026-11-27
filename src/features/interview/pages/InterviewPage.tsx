import { useEffect, useRef, useState } from 'react'
import { AuthApiError } from '../../auth/api/authApi'
import {
  completeInterviewSession,
  createInterviewSession,
  getInterviewSession,
  submitInterviewAnswer,
  type EvaluatedInterviewAnswerRecord,
  type InterviewEvaluationRecord,
  type InterviewSessionRecord,
} from '../api/interviewApi'
import { InterviewHistoryView } from '../components/InterviewHistoryView'
import { InterviewPreparationView } from '../components/InterviewPreparationView'
import { InterviewSessionView } from '../components/InterviewSessionView'
import {
  InterviewSetupView,
  type ManualContextFields,
} from '../components/InterviewSetupView'
import { InterviewSidebar } from '../components/InterviewSidebar'
import { InterviewSummaryView } from '../components/InterviewSummaryView'
import { EndSessionDialog } from '../components/EndSessionDialog'
import { experienceLevels, mockJobs } from '../mocks/interviewMock'
import type {
  ExperienceLevel,
  InterviewScreen,
  InterviewSession,
  InterviewSource,
  InterviewStage,
  WorkContext,
} from '../types/interview'
import styles from './InterviewPage.module.css'

const initialManualFields: ManualContextFields = {
  title: '',
  experienceLevel: '',
  description: '',
}

function cloneSession(session: InterviewSession): InterviewSession {
  return {
    ...session,
    context: { ...session.context },
    questions: session.questions.map((question) => ({
      ...question,
      feedback: question.feedback ? { ...question.feedback } : undefined,
    })),
  }
}

function isExperienceLevel(value: string): value is ExperienceLevel {
  return experienceLevels.some((level) => level.value === value)
}

function toInterviewSession(
  record: InterviewSessionRecord,
  context: WorkContext,
  elapsedSeconds = 0,
  currentQuestionIndex = 0,
): InterviewSession {
  return {
    id: record.id,
    context: { ...context, title: record.jobTitle },
    status: record.status,
    startedAt: record.startedAt,
    elapsedSeconds,
    currentQuestionIndex,
    questions: record.questions.map((question) => ({
      id: question.id,
      category: 'Pertanyaan wawancara',
      prompt: question.questionText,
      status: question.answer?.evaluation ? 'ANSWERED' : 'UNANSWERED',
      answer: question.answer?.answerText ?? '',
      feedback: question.answer?.evaluation
        ? toInterviewFeedback(question.answer.evaluation)
        : undefined,
    })),
    summary: record.summary,
  }
}

function toInterviewFeedback(evaluation: InterviewEvaluationRecord) {
  const { result } = evaluation
  return {
    relevance: result.dimensions.relevance.feedback,
    clarity: result.dimensions.clarity.feedback,
    completeness: result.dimensions.completeness.feedback,
    delivery: result.dimensions.delivery.feedback,
    dimensionScores: {
      relevance: result.dimensions.relevance.score,
      clarity: result.dimensions.clarity.score,
      completeness: result.dimensions.completeness.score,
      delivery: result.dimensions.delivery.score,
    },
    overallFeedback: result.overallFeedback,
    recommendation: result.improvementTips.join(' '),
    score: evaluation.score,
  }
}

function applyAnswerToSession(
  session: InterviewSession,
  questionId: string,
  answer: EvaluatedInterviewAnswerRecord,
): InterviewSession {
  return {
    ...session,
    questions: session.questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            answer: answer.answerText,
            status: 'ANSWERED',
            feedback: toInterviewFeedback(answer.evaluation),
          }
        : question,
    ),
  }
}

function getApiErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Permintaan wawancara tidak dapat diproses. Silakan coba lagi.'
}

export default function InterviewPage() {
  const [screen, setScreen] = useState<InterviewScreen>('setup')
  const [source, setSource] = useState<InterviewSource>('JOB')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    mockJobs[0]?.id ?? null,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [manualFields, setManualFields] =
    useState<ManualContextFields>(initialManualFields)
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [stage, setStage] = useState<InterviewStage>('answering')
  const [creationError, setCreationError] = useState('')
  const [creationTitle, setCreationTitle] = useState('')
  const [evaluationError, setEvaluationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completionError, setCompletionError] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [historyFilter, setHistoryFilter] =
    useState<'ALL' | InterviewSession['status']>('ALL')
  const sessionRef = useRef<InterviewSession | null>(null)
  const elapsedRef = useRef(0)
  const submissionInProgress = useRef(false)
  const completionInProgress = useRef(false)

  const currentQuestion =
    session?.questions[session.currentQuestionIndex] ?? null
  const validManualContext =
    manualFields.title.trim().length >= 2 &&
    manualFields.experienceLevel !== ''

  function saveSession(nextSession: InterviewSession) {
    sessionRef.current = nextSession
    setSession(nextSession)
    setSessions((records) => {
      const exists = records.some((record) => record.id === nextSession.id)
      return exists
        ? records.map((record) =>
            record.id === nextSession.id ? nextSession : record,
          )
        : [nextSession, ...records]
    })
  }

  useEffect(() => {
    if (screen !== 'session') return
    const timer = window.setInterval(() => {
      const nextElapsed = elapsedRef.current + 1
      elapsedRef.current = nextElapsed
      setElapsedSeconds(nextElapsed)
      const current = sessionRef.current
      if (current) {
        saveSession({ ...current, elapsedSeconds: nextElapsed })
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [screen])

  useEffect(() => {
    if (!isEndDialogOpen) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !completionInProgress.current) {
        setIsEndDialogOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isEndDialogOpen])

  function buildContext(): WorkContext | null {
    if (source === 'JOB') {
      const job = mockJobs.find(({ id }) => id === selectedJobId)
      if (!job) return null
      return {
        source: 'JOB',
        title: job.title,
        company: job.company,
        employmentType: job.employmentType,
        experienceLevel: 'MIDDLE',
        description: '',
      }
    }

    if (!validManualContext || !isExperienceLevel(manualFields.experienceLevel)) {
      return null
    }
    return {
      source: 'MANUAL',
      title: manualFields.title.trim(),
      company: 'Konteks Manual',
      employmentType: 'Latihan teks',
      experienceLevel: manualFields.experienceLevel,
      description: manualFields.description.trim(),
    }
  }

  async function startSession() {
    const context = buildContext()
    if (!context) return
    setCreationError('')
    setCreationTitle(context.title)
    setScreen('preparing')
    try {
      const created = await createInterviewSession(context.title)
      const nextSession = toInterviewSession(created, context)
      elapsedRef.current = 0
      setElapsedSeconds(0)
      saveSession(nextSession)
      setStage('answering')
      setScreen('session')
    } catch (error) {
      setCreationError(getApiErrorMessage(error))
      setScreen('preparation-error')
    }
  }

  function returnToSetup() {
    setCreationError('')
    setScreen('setup')
  }

  function retryPreparation() {
    void startSession()
  }

  function updateCurrentQuestion(
    updater: (question: NonNullable<typeof currentQuestion>) => NonNullable<typeof currentQuestion>,
  ) {
    const current = sessionRef.current
    if (!current) return
    const question = current.questions[current.currentQuestionIndex]
    if (!question) return
    const updatedQuestion = updater(question)
    const questions = current.questions.map((item) =>
      item.id === updatedQuestion.id ? updatedQuestion : item,
    )
    saveSession({ ...current, questions })
  }

  function changeAnswer(value: string) {
    updateCurrentQuestion((question) => ({
      ...question,
      answer: value,
      status: 'UNANSWERED',
      feedback: undefined,
    }))
  }

  async function sendCurrentAnswer(reconcileBeforeRetry = false) {
    const current = sessionRef.current
    const question = current?.questions[current.currentQuestionIndex]
    const answerText = question?.answer.trim()
    if (!current || !question || !answerText || submissionInProgress.current) {
      return
    }

    submissionInProgress.current = true
    setIsSubmitting(true)
    setEvaluationError('')
    setStage('evaluating')

    try {
      if (reconcileBeforeRetry) {
        const remote = await getInterviewSession(current.id)
        const remoteQuestion = remote.questions.find(
          (item) => item.id === question.id,
        )
        if (remote.status === 'COMPLETED') {
          const completed = toInterviewSession(
            remote,
            current.context,
            elapsedRef.current,
            current.currentQuestionIndex,
          )
          saveSession(completed)
          setIsEndDialogOpen(false)
          setScreen('summary')
          return
        }
        if (remote.status !== 'IN_PROGRESS') {
          throw new AuthApiError('Sesi wawancara sudah tidak dapat dilanjutkan.', 409)
        }
        if (!remoteQuestion) {
          throw new AuthApiError('Pertanyaan tidak ditemukan pada sesi ini.', 404)
        }
        if (remoteQuestion.answer?.evaluation) {
          saveSession(
            toInterviewSession(
              remote,
              current.context,
              elapsedRef.current,
              current.currentQuestionIndex,
            ),
          )
          setStage('feedback')
          return
        }
        if (remoteQuestion.answer) {
          throw new AuthApiError(
            'Jawaban sudah tersimpan, tetapi evaluasinya belum tersedia. Muat ulang sesi sebelum mencoba lagi.',
            409,
          )
        }
      }

      const answer = await submitInterviewAnswer(
        current.id,
        question.id,
        answerText,
      )
      const latest = sessionRef.current ?? current
      saveSession(applyAnswerToSession(latest, question.id, answer))
      setStage('feedback')
    } catch (error) {
      setEvaluationError(getApiErrorMessage(error))
      setStage('evaluation-error')
    } finally {
      submissionInProgress.current = false
      setIsSubmitting(false)
    }
  }

  function submitAnswer() {
    void sendCurrentAnswer()
  }

  function retryEvaluation() {
    void sendCurrentAnswer(true)
  }

  function moveToNextQuestion() {
    const current = sessionRef.current
    if (!current) return
    if (current.currentQuestionIndex >= current.questions.length - 1) {
      setStage('complete')
      return
    }
    saveSession({
      ...current,
      currentQuestionIndex: current.currentQuestionIndex + 1,
    })
    setStage('answering')
  }

  function skipQuestion() {
    const current = sessionRef.current
    if (!current) return
    const question = current.questions[current.currentQuestionIndex]
    if (!question) return
    const questions = current.questions.map((item) =>
      item.id === question.id
        ? { ...item, status: 'SKIPPED' as const }
        : item,
    )
    const isLast = current.currentQuestionIndex >= questions.length - 1
    saveSession({
      ...current,
      questions,
      currentQuestionIndex: isLast
        ? current.currentQuestionIndex
        : current.currentQuestionIndex + 1,
    })
    setStage(isLast ? 'complete' : 'answering')
  }

  function returnToUnansweredQuestion() {
    const current = sessionRef.current
    if (!current) return
    const index = current.questions.findIndex(
      (question) => question.status !== 'ANSWERED',
    )
    if (index < 0) return
    saveSession({ ...current, currentQuestionIndex: index })
    setStage('answering')
  }

  function endSession() {
    const current = sessionRef.current
    if (!current?.questions.every((question) => question.status === 'ANSWERED')) {
      return
    }
    setCompletionError('')
    setIsEndDialogOpen(true)
  }

  async function confirmEndSession() {
    const current = sessionRef.current
    if (
      !current ||
      !current.questions.every((question) => question.status === 'ANSWERED') ||
      completionInProgress.current
    ) {
      return
    }

    completionInProgress.current = true
    setIsCompleting(true)
    setCompletionError('')
    try {
      const completed = await completeInterviewSession(current.id)
      const nextSession = toInterviewSession(
        completed.session,
        current.context,
        elapsedRef.current,
        current.questions.length - 1,
      )
      saveSession({ ...nextSession, summary: completed.summary })
      setIsEndDialogOpen(false)
      setScreen('summary')
    } catch (error) {
      setCompletionError(getApiErrorMessage(error))
    } finally {
      completionInProgress.current = false
      setIsCompleting(false)
    }
  }

  function beginNewSession() {
    sessionRef.current = null
    setSession(null)
    setManualFields(initialManualFields)
    setSelectedJobId(mockJobs[0]?.id ?? null)
    setSearchTerm('')
    setSource('JOB')
    setIsEndDialogOpen(false)
    setScreen('setup')
  }

  function openSessionSummary(nextSession: InterviewSession) {
    const copy = cloneSession(nextSession)
    saveSession(copy)
    elapsedRef.current = copy.elapsedSeconds
    setElapsedSeconds(copy.elapsedSeconds)
    setScreen('summary')
  }

  function resumeSession(nextSession: InterviewSession) {
    const copy = cloneSession(nextSession)
    saveSession(copy)
    elapsedRef.current = copy.elapsedSeconds
    setElapsedSeconds(copy.elapsedSeconds)
    const activeQuestion = copy.questions[copy.currentQuestionIndex]
    setStage(
      activeQuestion?.feedback
        ? 'feedback'
        : activeQuestion?.status === 'ANSWERED'
          ? 'evaluation-error'
          : 'answering',
    )
    setScreen('session')
  }

  function clearDemoHistory() {
    setSessions([])
    sessionRef.current = null
    setSession(null)
    setScreen('history')
  }

  const pageTitle =
    screen === 'history' ? 'Semua Sesi Latihan' : 'AI Interview Preparation'
  return (
    <section className={styles.page} aria-labelledby="interview-page-title">
      {screen !== 'preparing' && screen !== 'preparation-error' && (
        <header className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>Ruang karier pelamar</span>
            <h1 id="interview-page-title">{pageTitle}</h1>
            <p>
              {screen === 'history'
                ? 'Tinjau dan lanjutkan latihan wawancara berbasis teks.'
                : 'Latih jawaban wawancara dengan konteks pekerjaan yang kamu pilih.'}
            </p>
          </div>
        </header>
      )}

      {screen === 'preparing' && (
        <InterviewPreparationView
          onCancel={returnToSetup}
          title={creationTitle}
        />
      )}

      {screen === 'preparation-error' && (
        <InterviewPreparationView
          failed
          errorMessage={creationError}
          onCancel={returnToSetup}
          onRetry={retryPreparation}
          title={creationTitle}
        />
      )}

      {screen === 'session' && session && (
        <InterviewSessionView
          elapsedSeconds={elapsedSeconds}
          isSubmitting={isSubmitting}
          onAnswerChange={changeAnswer}
          onEnd={endSession}
          onNext={moveToNextQuestion}
          onReturnToUnanswered={returnToUnansweredQuestion}
          onRetryEvaluation={retryEvaluation}
          onSkip={skipQuestion}
          onSubmit={submitAnswer}
          question={currentQuestion}
          questionIndex={session.currentQuestionIndex}
          session={session}
          stage={stage}
          submissionError={evaluationError}
        />
      )}

      {(screen === 'setup' ||
        screen === 'summary' ||
        screen === 'history') && (
        <div className={styles.workspace}>
          <div className={styles.primaryColumn}>
            {screen === 'setup' && (
              <InterviewSetupView
                jobs={mockJobs}
                manualFields={manualFields}
                onCancel={() => {
                  setSource('JOB')
                  setSelectedJobId(null)
                  setSearchTerm('')
                  setManualFields(initialManualFields)
                }}
                onManualFieldChange={(field, value) => {
                  if (field === 'experienceLevel') {
                    setManualFields((fields) => ({
                      ...fields,
                      experienceLevel: isExperienceLevel(value) ? value : '',
                    }))
                  } else {
                    setManualFields((fields) => ({ ...fields, [field]: value }))
                  }
                }}
                onSearchChange={setSearchTerm}
                onSelectJob={setSelectedJobId}
                onSourceChange={setSource}
                onStart={() => void startSession()}
                searchTerm={searchTerm}
                selectedJobId={selectedJobId}
                source={source}
              />
            )}

            {screen === 'summary' && session && (
              <InterviewSummaryView
                onNewSession={beginNewSession}
                onOpenHistory={() => setScreen('history')}
                session={session}
              />
            )}

            {screen === 'history' && (
              <InterviewHistoryView
                onClearDemoHistory={clearDemoHistory}
                onNewSession={beginNewSession}
                onOpenSession={openSessionSummary}
                onResumeSession={resumeSession}
                onSearchChange={setHistorySearch}
                onStatusChange={setHistoryFilter}
                searchTerm={historySearch}
                sessions={sessions}
                statusFilter={historyFilter}
              />
            )}
          </div>

          <InterviewSidebar
            onOpenHistory={() => setScreen('history')}
            onResume={resumeSession}
            sessions={sessions}
          />
        </div>
      )}

      {isEndDialogOpen && session && (
        <EndSessionDialog
          errorMessage={completionError}
          isSubmitting={isCompleting}
          onConfirmEnd={() => void confirmEndSession()}
          onContinue={() => {
            if (!completionInProgress.current) setIsEndDialogOpen(false)
          }}
          session={session}
        />
      )}

      {screen === 'summary' && session && (
        <p className={styles.summaryStatus} role="status">
          Jawaban dan evaluasi tersimpan pada sesi backend.
        </p>
      )}
    </section>
  )
}
