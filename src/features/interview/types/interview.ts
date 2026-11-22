export type InterviewSource = 'JOB' | 'MANUAL'
export type ExperienceLevel =
  | 'FRESH_GRADUATE'
  | 'JUNIOR'
  | 'MIDDLE'
  | 'SENIOR'
export type InterviewSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type InterviewQuestionStatus = 'UNANSWERED' | 'ANSWERED' | 'SKIPPED'
export type InterviewStage =
  | 'answering'
  | 'evaluating'
  | 'evaluation-error'
  | 'feedback'
  | 'complete'
export type InterviewScreen =
  | 'setup'
  | 'preparing'
  | 'preparation-error'
  | 'session'
  | 'summary'
  | 'history'
export type DemoFailureMode = 'NONE' | 'PREPARATION' | 'EVALUATION'

export interface JobContext {
  id: string
  title: string
  company: string
  employmentType: string
}

export interface WorkContext {
  source: InterviewSource
  title: string
  company: string
  employmentType: string
  experienceLevel: ExperienceLevel
  description: string
}

export interface InterviewFeedback {
  relevance: string
  clarity: string
  completeness: string
  recommendation: string
  score?: number
}

export interface InterviewQuestion {
  id: string
  category: string
  prompt: string
  status: InterviewQuestionStatus
  answer: string
  feedback?: InterviewFeedback
}

export interface InterviewSession {
  id: string
  context: WorkContext
  status: InterviewSessionStatus
  startedAt: string
  endedAt?: string
  elapsedSeconds: number
  currentQuestionIndex: number
  questions: InterviewQuestion[]
}
