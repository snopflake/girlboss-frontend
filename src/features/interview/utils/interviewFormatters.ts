import type {
  InterviewQuestion,
  InterviewSession,
  InterviewSessionStatus,
} from '../types/interview'

export function formatInterviewDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatInterviewDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function getAnsweredCount(questions: InterviewQuestion[]) {
  return questions.filter(
    (question) =>
      question.status === 'ANSWERED' && question.answer.trim().length > 0,
  ).length
}

export function getAverageScore(session: InterviewSession) {
  const scores = session.questions
    .map((question) => question.feedback?.score)
    .filter(
      (score): score is number =>
        typeof score === 'number' &&
        Number.isFinite(score) &&
        score >= 0 &&
        score <= 100,
    )

  if (scores.length === 0) return null
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
}

export function getSessionStatusLabel(status: InterviewSessionStatus) {
  switch (status) {
    case 'IN_PROGRESS':
      return 'Berlangsung'
    case 'COMPLETED':
      return 'Selesai'
    case 'CANCELLED':
      return 'Dibatalkan'
  }
}
