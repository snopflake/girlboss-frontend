import { useEffect, useRef, useState } from 'react'
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
import {
  createInterviewQuestions,
  createMockFeedback,
  experienceLevels,
  initialInterviewSessions,
  mockJobs,
} from '../mocks/interviewMock'
import type {
  DemoFailureMode,
  ExperienceLevel,
  InterviewScreen,
  InterviewSession,
  InterviewSource,
  InterviewStage,
  WorkContext,
} from '../types/interview'
import { getAnsweredCount } from '../utils/interviewFormatters'
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

export default function InterviewPage() {
  const [screen, setScreen] = useState<InterviewScreen>('setup')
  const [source, setSource] = useState<InterviewSource>('JOB')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    mockJobs[0]?.id ?? null,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [manualFields, setManualFields] =
    useState<ManualContextFields>(initialManualFields)
  const [sessions, setSessions] = useState<InterviewSession[]>(() =>
    initialInterviewSessions.map(cloneSession),
  )
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [stage, setStage] = useState<InterviewStage>('answering')
  const [progress, setProgress] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [demoFailureMode, setDemoFailureMode] =
    useState<DemoFailureMode>('NONE')
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [historyFilter, setHistoryFilter] =
    useState<'ALL' | InterviewSession['status']>('ALL')
  const sessionRef = useRef<InterviewSession | null>(null)
  const elapsedRef = useRef(0)

  const currentQuestion =
    session?.questions[session.currentQuestionIndex] ?? null
  const validManualContext =
    manualFields.title.trim().length > 0 &&
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
    if (screen !== 'preparing' || progress >= 100) return
    const timer = window.setTimeout(() => {
      setProgress((value) => Math.min(value + 25, 100))
    }, 320)
    return () => window.clearTimeout(timer)
  }, [progress, screen])

  useEffect(() => {
    if (screen !== 'preparing' || progress < 100) return
    const timer = window.setTimeout(() => {
      if (demoFailureMode === 'PREPARATION') {
        setDemoFailureMode('NONE')
        setScreen('preparation-error')
        return
      }
      setStage('answering')
      setScreen('session')
    }, 320)
    return () => window.clearTimeout(timer)
  }, [demoFailureMode, progress, screen])

  const questionId = currentQuestion?.id ?? null
  useEffect(() => {
    if (screen !== 'session' || stage !== 'evaluating' || !questionId) return
    const timer = window.setTimeout(() => {
      if (demoFailureMode === 'EVALUATION') {
        setDemoFailureMode('NONE')
        setStage('evaluation-error')
        return
      }

      const current = sessionRef.current
      if (!current) return
      const questions = current.questions.map((question) =>
        question.id === questionId
          ? { ...question, feedback: createMockFeedback() }
          : question,
      )
      saveSession({ ...current, questions })
      setStage('feedback')
    }, 900)
    return () => window.clearTimeout(timer)
  }, [demoFailureMode, questionId, screen, stage])

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
      if (event.key === 'Escape') setIsEndDialogOpen(false)
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

  function startSession() {
    const context = buildContext()
    if (!context) return
    const nextSession: InterviewSession = {
      id: `interview-${Date.now()}`,
      context,
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      currentQuestionIndex: 0,
      questions: createInterviewQuestions(),
    }
    elapsedRef.current = 0
    setElapsedSeconds(0)
    saveSession(nextSession)
    setStage('answering')
    setProgress(0)
    setScreen('preparing')
  }

  function cancelPreparation() {
    const current = sessionRef.current
    if (current) {
      const cancelledSession = {
        ...current,
        status: 'CANCELLED' as const,
        endedAt: new Date().toISOString(),
        elapsedSeconds: elapsedRef.current,
      }
      sessionRef.current = cancelledSession
      setSessions((records) => [
        cancelledSession,
        ...records.filter((record) => record.id !== cancelledSession.id),
      ])
    }
    sessionRef.current = null
    setSession(null)
    setProgress(0)
    setScreen('setup')
  }

  function retryPreparation() {
    setProgress(0)
    setScreen('preparing')
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
    updateCurrentQuestion((question) => ({ ...question, answer: value }))
  }

  function submitAnswer() {
    if (!currentQuestion?.answer.trim()) return
    updateCurrentQuestion((question) => ({
      ...question,
      status: 'ANSWERED',
      feedback: undefined,
    }))
    setStage('evaluating')
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

  function answerAgain() {
    setStage('answering')
  }

  function endSession() {
    setIsEndDialogOpen(true)
  }

  function confirmEndSession() {
    const current = sessionRef.current
    if (!current) return
    saveSession({
      ...current,
      status: 'COMPLETED',
      endedAt: new Date().toISOString(),
      elapsedSeconds: elapsedRef.current,
    })
    setIsEndDialogOpen(false)
    setScreen('summary')
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
  const answeredCount = session ? getAnsweredCount(session.questions) : 0

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
          onCancel={cancelPreparation}
          progress={progress}
          title={session?.context.title ?? ''}
        />
      )}

      {screen === 'preparation-error' && (
        <InterviewPreparationView
          failed
          onCancel={cancelPreparation}
          onRetry={retryPreparation}
          progress={progress}
          title={session?.context.title ?? ''}
        />
      )}

      {screen === 'session' && session && (
        <InterviewSessionView
          demoFailureMode={demoFailureMode}
          elapsedSeconds={elapsedSeconds}
          onAnswerAgain={answerAgain}
          onAnswerChange={changeAnswer}
          onDemoFailureModeChange={setDemoFailureMode}
          onEnd={endSession}
          onNext={moveToNextQuestion}
          onRetryEvaluation={() => setStage('evaluating')}
          onSkip={skipQuestion}
          onSubmit={submitAnswer}
          question={currentQuestion}
          questionIndex={session.currentQuestionIndex}
          session={session}
          stage={stage}
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
                onStart={startSession}
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
            demoFailureMode={demoFailureMode}
            onDemoFailureModeChange={setDemoFailureMode}
            onOpenHistory={() => setScreen('history')}
            onResume={resumeSession}
            sessions={sessions}
          />
        </div>
      )}

      {isEndDialogOpen && session && (
        <EndSessionDialog
          onConfirmEnd={confirmEndSession}
          onContinue={() => setIsEndDialogOpen(false)}
          session={session}
        />
      )}

      {screen === 'summary' && session && (
        <p className={styles.summaryStatus} role="status">
          {answeredCount} jawaban tersimpan dalam sesi ini. Jawaban tidak
          disimpan permanen setelah sesi aplikasi berakhir.
        </p>
      )}
    </section>
  )
}
