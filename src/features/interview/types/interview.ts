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
export type InterviewAnswerMode = 'TEXT' | 'AUDIO'
export type InterviewScreen =
  | 'setup'
  | 'preparing'
  | 'preparation-error'
  | 'session'
  | 'summary'
  | 'history'
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

export interface InterviewSessionContext {
  title: string
  company?: string
  employmentType?: string
}

export interface InterviewSpeechMetrics {
  durationSeconds: number | null
  durationStatus: 'MEASURED' | 'UNAVAILABLE'
  wordCount: number | null
  wordsPerMinute: number | null
  speechRateStatus:
    | 'MEASURED'
    | 'INSUFFICIENT_TRANSCRIPT'
    | 'UNAVAILABLE'
  pauseCount: number | null
  totalPauseSeconds: number | null
  pauseStatus:
    | 'ESTIMATED_FROM_SEGMENTS'
    | 'MEASURED'
    | 'INSUFFICIENT_SEGMENTS'
    | 'UNAVAILABLE'
  pauseSource?: 'WHISPER_SEGMENT_TIMESTAMPS'
  pauseThresholdSeconds?: number
  pitchMedianHz?: number | null
  pitchVariation: number | null
  pitchVariationUnit?: 'semitones'
  voicedFrameCount?: number | null
  pitchStatus:
    | 'MEASURED'
    | 'INSUFFICIENT_VOICED_FRAMES'
    | 'UNSUPPORTED_FORMAT'
    | 'NOT_ANALYZED'
  pitchFeedback?: string
  deliveryFeedback: string
}

export interface InterviewFeedback {
  relevance: string
  clarity: string
  completeness: string
  delivery?: string
  overallFeedback?: string
  dimensionScores?: {
    relevance: number
    clarity: number
    completeness: number
    delivery: number
  }
  recommendation: string
  score?: number
  speechMetrics?: InterviewSpeechMetrics
}

export interface InterviewSummary {
  answeredQuestions: number
  totalQuestions: number
  averageScore: number
  dimensionAverages: {
    relevance: number
    clarity: number
    completeness: number
    delivery: number
  }
  improvementTips: string[]
}

export interface InterviewQuestion {
  id: string
  category: string
  prompt: string
  status: InterviewQuestionStatus
  answer: string
  answerSource?: 'TEXT' | 'AUDIO'
  feedback?: InterviewFeedback
}

export interface InterviewSession {
  id: string
  context: InterviewSessionContext
  status: InterviewSessionStatus
  startedAt: string
  endedAt?: string
  elapsedSeconds: number | null
  currentQuestionIndex: number
  questions: InterviewQuestion[]
  summary?: InterviewSummary | null
}
