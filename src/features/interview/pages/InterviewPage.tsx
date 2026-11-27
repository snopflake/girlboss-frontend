import { useCallback, useEffect, useRef, useState } from 'react'
import { AuthApiError } from '../../auth/api/authApi'
import {
  completeInterviewSession,
  createInterviewSession,
  getInterviewSession,
  listInterviewSessions,
  submitInterviewAnswer,
  submitInterviewAudioAnswer,
  type EvaluatedInterviewAnswerRecord,
  type InterviewEvaluationRecord,
  type InterviewSessionListResult,
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
  InterviewAnswerMode,
  InterviewStage,
  WorkContext,
  InterviewSessionContext,
} from '../types/interview'
import styles from './InterviewPage.module.css'

const initialManualFields: ManualContextFields = {
  title: '',
  experienceLevel: '',
  description: '',
}

function isExperienceLevel(value: string): value is ExperienceLevel {
  return experienceLevels.some((level) => level.value === value)
}

function toInterviewSession(
  record: InterviewSessionRecord,
  context: InterviewSessionContext | WorkContext = { title: record.jobTitle },
  elapsedSeconds: number | null = 0,
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
      status: question.answer ? 'ANSWERED' : 'UNANSWERED',
      answer: question.answer?.answerText ?? '',
      answerSource: question.answer?.evaluation?.speechMetrics
        ? 'AUDIO'
        : question.answer
          ? 'TEXT'
          : undefined,
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
    speechMetrics: evaluation.speechMetrics,
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
            answerSource: answer.evaluation.speechMetrics ? 'AUDIO' : 'TEXT',
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
  const [historySessions, setHistorySessions] = useState<InterviewSession[]>([])
  const [historyPagination, setHistoryPagination] =
    useState<InterviewSessionListResult['pagination'] | null>(null)
  const [historyPage, setHistoryPage] = useState(1)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')
  const [detailError, setDetailError] = useState('')
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null)
  const [lastSelectedSession, setLastSelectedSession] =
    useState<InterviewSession | null>(null)
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [answerMode, setAnswerMode] = useState<InterviewAnswerMode>('TEXT')
  const [pendingAudioFile, setPendingAudioFile] = useState<File | null>(null)
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

  const refreshHistory = useCallback(() => {
    setIsHistoryLoading(true)
    setHistoryError('')
    setHistoryPage(1)
    setHistoryRefreshKey((key) => key + 1)
  }, [])

  useEffect(() => {
    let active = true
    void listInterviewSessions(historyPage, 10)
      .then((result) => {
        if (!active) return
        const mappedSessions = result.sessions.map((record) =>
          toInterviewSession(record, { title: record.jobTitle }, null),
        )
        setHistorySessions(mappedSessions)
        setHistoryPagination(result.pagination)
        if (historyPage === 1) {
          setSessions((current) => {
            const serverIds = new Set(mappedSessions.map((item) => item.id))
            const localSessions = current.filter(
              (item) => !serverIds.has(item.id),
            )
            return [...mappedSessions, ...localSessions].slice(0, 10)
          })
        }
      })
      .catch((error: unknown) => {
        if (active) setHistoryError(getApiErrorMessage(error))
      })
      .finally(() => {
        if (active) setIsHistoryLoading(false)
      })
    return () => {
      active = false
    }
  }, [historyPage, historyRefreshKey])

  function retryHistory() {
    refreshHistory()
  }

  function openHistory() {
    refreshHistory()
    setScreen('history')
  }

  function changeHistoryPage(page: number) {
    setIsHistoryLoading(true)
    setHistoryError('')
    setHistoryPage(page)
  }

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
      setAnswerMode('TEXT')
      setPendingAudioFile(null)
      saveSession(nextSession)
      refreshHistory()
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

  const handleAudioFileChange = useCallback((file: File | null) => {
    setPendingAudioFile(file)
  }, [])

  function changeAnswerMode(mode: InterviewAnswerMode) {
    setAnswerMode(mode)
    if (mode === 'TEXT') setPendingAudioFile(null)
  }

  async function sendCurrentAnswer(
    reconcileBeforeRetry = false,
    requestedMode: InterviewAnswerMode = answerMode,
    audioOverride?: File,
  ) {
    const current = sessionRef.current
    const question = current?.questions[current.currentQuestionIndex]
    const answerText = question?.answer.trim()
    const audioFile = audioOverride ?? pendingAudioFile
    if (
      !current ||
      !question ||
      submissionInProgress.current ||
      (requestedMode === 'TEXT' && !answerText) ||
      (requestedMode === 'AUDIO' && !audioFile)
    ) {
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
          refreshHistory()
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
          setPendingAudioFile(null)
          refreshHistory()
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

      const answer =
        requestedMode === 'AUDIO'
          ? await submitInterviewAudioAnswer(
              current.id,
              question.id,
              audioFile!,
            )
          : await submitInterviewAnswer(current.id, question.id, answerText!)
      const latest = sessionRef.current ?? current
      saveSession(applyAnswerToSession(latest, question.id, answer))
      if (requestedMode === 'AUDIO') setPendingAudioFile(null)
      refreshHistory()
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
    setAnswerMode('TEXT')
    setPendingAudioFile(null)
    void sendCurrentAnswer(false, 'TEXT')
  }

  function submitAudioAnswer(file: File) {
    setAnswerMode('AUDIO')
    setPendingAudioFile(file)
    void sendCurrentAnswer(false, 'AUDIO', file)
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
    const nextIndex = current.currentQuestionIndex + 1
    const nextQuestion = current.questions[nextIndex]
    saveSession({ ...current, currentQuestionIndex: nextIndex })
    setPendingAudioFile(null)
    if (nextQuestion?.feedback) {
      setAnswerMode(nextQuestion.answerSource === 'AUDIO' ? 'AUDIO' : 'TEXT')
      setEvaluationError('')
      setStage('feedback')
    } else if (nextQuestion?.status === 'ANSWERED') {
      setAnswerMode(nextQuestion.answerSource === 'AUDIO' ? 'AUDIO' : 'TEXT')
      setEvaluationError(
        'Jawaban tersimpan, tetapi evaluasinya belum tersedia. Periksa kembali status sesi sebelum mengirim ulang.',
      )
      setStage('evaluation-error')
    } else {
      setEvaluationError('')
      setStage('answering')
    }
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
    setPendingAudioFile(null)
    setAnswerMode('TEXT')
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
    setPendingAudioFile(null)
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
      refreshHistory()
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
    setAnswerMode('TEXT')
    setPendingAudioFile(null)
    setIsEndDialogOpen(false)
    setScreen('setup')
  }

  async function openSessionDetails(sessionRow: InterviewSession) {
    setLastSelectedSession(sessionRow)
    setLoadingSessionId(sessionRow.id)
    setDetailError('')
    try {
      const record = await getInterviewSession(sessionRow.id)
      const savedContext =
        sessionRef.current?.id === record.id
          ? sessionRef.current.context
          : sessions.find((item) => item.id === record.id)?.context
      const nextSession = toInterviewSession(
        record,
        savedContext ?? { title: record.jobTitle },
        record.status === 'IN_PROGRESS' ? 0 : null,
        0,
      )
      saveSession(nextSession)
      setPendingAudioFile(null)
      setAnswerMode('TEXT')
      setElapsedSeconds(0)
      elapsedRef.current = 0

      if (record.status === 'IN_PROGRESS') {
        const firstQuestion = nextSession.questions[0]
        if (firstQuestion?.feedback) {
          setEvaluationError('')
          setStage('feedback')
        } else if (firstQuestion?.status === 'ANSWERED') {
          setEvaluationError(
            'Jawaban tersimpan, tetapi evaluasinya belum tersedia. Periksa kembali status sesi sebelum mengirim ulang.',
          )
          setStage('evaluation-error')
        } else {
          setEvaluationError('')
          setStage('answering')
        }
        setScreen('session')
      } else {
        setScreen('summary')
      }
    } catch (error) {
      setDetailError(getApiErrorMessage(error))
    } finally {
      setLoadingSessionId(null)
    }
  }

  function retrySessionDetails() {
    if (lastSelectedSession) void openSessionDetails(lastSelectedSession)
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
                ? 'Tinjau, lanjutkan, dan pelajari hasil sesi wawancara.'
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
          answerMode={answerMode}
          elapsedSeconds={elapsedSeconds}
          isSubmitting={isSubmitting}
          onAnswerChange={changeAnswer}
          onAnswerModeChange={changeAnswerMode}
          onAudioFileChange={handleAudioFileChange}
          onEnd={endSession}
          onNext={moveToNextQuestion}
          onReturnToUnanswered={returnToUnansweredQuestion}
          onRetryEvaluation={retryEvaluation}
          onSkip={skipQuestion}
          onSubmit={submitAnswer}
          onSubmitAudio={submitAudioAnswer}
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
                onOpenHistory={openHistory}
                session={session}
              />
            )}

            {screen === 'history' && (
              <InterviewHistoryView
                detailErrorMessage={detailError}
                errorMessage={historyError}
                isLoading={isHistoryLoading}
                loadingSessionId={loadingSessionId}
                onNewSession={beginNewSession}
                onOpenSession={(selected) => void openSessionDetails(selected)}
                onPageChange={changeHistoryPage}
                onRetryDetail={retrySessionDetails}
                onRetryList={retryHistory}
                onSearchChange={setHistorySearch}
                onStatusChange={setHistoryFilter}
                pagination={historyPagination}
                searchTerm={historySearch}
                sessions={historySessions}
                statusFilter={historyFilter}
              />
            )}
          </div>

          <InterviewSidebar
            detailErrorMessage={detailError}
            errorMessage={historyError}
            isLoading={isHistoryLoading}
            loadingSessionId={loadingSessionId}
            onOpenHistory={openHistory}
            onRetry={retryHistory}
            onRetryDetail={retrySessionDetails}
            onSelectSession={(selected) => void openSessionDetails(selected)}
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
