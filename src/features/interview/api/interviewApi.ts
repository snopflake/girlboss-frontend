import { z } from 'zod'
import {
  apiRequest,
  AuthApiError,
  getStoredAccessToken,
} from '../../auth/api/authApi'

const interviewQuestionSchema = z
  .object({
    id: z.uuid(),
    questionText: z.string().min(20).max(400),
    sequenceNumber: z.number().int().positive(),
    answer: z.null(),
  })
  .strict()

const interviewDimensionSchema = z
  .object({
    score: z.number().min(0).max(5),
    feedback: z.string().min(1),
  })
  .strict()

const speechDeliveryMetricsSchema = z
  .object({
    durationSeconds: z.number().positive().nullable(),
    durationStatus: z.enum(['MEASURED', 'UNAVAILABLE']),
    wordCount: z.number().int().nonnegative().nullable(),
    wordsPerMinute: z.number().nonnegative().nullable(),
    speechRateStatus: z.enum([
      'MEASURED',
      'INSUFFICIENT_TRANSCRIPT',
      'UNAVAILABLE',
    ]),
    pauseCount: z.number().int().nonnegative().nullable(),
    totalPauseSeconds: z.number().nonnegative().nullable(),
    pauseStatus: z.enum([
      'ESTIMATED_FROM_SEGMENTS',
      'MEASURED',
      'INSUFFICIENT_SEGMENTS',
      'UNAVAILABLE',
    ]),
    pauseSource: z.literal('WHISPER_SEGMENT_TIMESTAMPS').optional(),
    pauseThresholdSeconds: z.number().positive().optional(),
    pitchMedianHz: z.number().positive().nullable().optional(),
    pitchVariation: z.number().nonnegative().nullable(),
    pitchVariationUnit: z.literal('semitones').optional(),
    voicedFrameCount: z.number().int().nonnegative().nullable().optional(),
    pitchStatus: z.enum([
      'MEASURED',
      'INSUFFICIENT_VOICED_FRAMES',
      'UNSUPPORTED_FORMAT',
      'NOT_ANALYZED',
    ]),
    pitchFeedback: z.string().min(1).max(500).optional(),
    deliveryFeedback: z.string().min(1).max(1_000),
  })
  .strict()

const interviewEvaluationResultSchema = z
  .object({
    dimensions: z
      .object({
        relevance: interviewDimensionSchema,
        clarity: interviewDimensionSchema,
        completeness: interviewDimensionSchema,
        delivery: interviewDimensionSchema,
      })
      .strict(),
    overallFeedback: z.string().min(1),
    improvementTips: z.array(z.string().min(1)),
  })
  .strict()

const interviewEvaluationSchema = z
  .object({
    score: z.number().int().min(0).max(100),
    evaluatedAt: z.string().min(1),
    result: interviewEvaluationResultSchema,
    speechMetrics: speechDeliveryMetricsSchema.optional(),
  })
  .strict()

const interviewAnswerSchema = z
  .object({
    id: z.uuid(),
    answerText: z.string().min(1),
    submittedAt: z.string().min(1),
    evaluation: interviewEvaluationSchema.nullable(),
  })
  .strict()

const evaluatedInterviewAnswerSchema = interviewAnswerSchema.extend({
  evaluation: interviewEvaluationSchema,
})

const interviewSummarySchema = z
  .object({
    answeredQuestions: z.number().int().nonnegative(),
    totalQuestions: z.number().int().positive(),
    averageScore: z.number().min(0).max(100),
    dimensionAverages: z
      .object({
        relevance: z.number().min(0).max(5),
        clarity: z.number().min(0).max(5),
        completeness: z.number().min(0).max(5),
        delivery: z.number().min(0).max(5),
      })
      .strict(),
    improvementTips: z.array(z.string().min(1)),
  })
  .strict()

const interviewSessionSchema = z
  .object({
    id: z.uuid(),
    jobTitle: z.string().min(2),
    status: z.enum(['IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    startedAt: z.string().min(1),
    questions: z.array(
      interviewQuestionSchema.extend({
        answer: interviewAnswerSchema.nullable(),
      }),
    ).length(5),
    summary: interviewSummarySchema.nullable(),
  })
  .strict()

const createdInterviewSessionSchema = z
  .object({
    id: z.uuid(),
    jobTitle: z.string().min(2),
    status: z.literal('IN_PROGRESS'),
    startedAt: z.string().min(1),
    questions: z.array(interviewQuestionSchema).length(5),
    summary: z.null(),
  })
  .strict()

const createInterviewSessionEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: createdInterviewSessionSchema,
  })
  .strict()

const submitInterviewAnswerEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: z.object({ answer: evaluatedInterviewAnswerSchema }).strict(),
  })
  .strict()

const interviewSessionDetailEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: interviewSessionSchema,
  })
  .strict()

const interviewSessionListEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: z
      .object({
        sessions: z.array(interviewSessionSchema),
        pagination: z
          .object({
            page: z.number().int().positive(),
            pageSize: z.number().int().positive(),
            total: z.number().int().nonnegative(),
            totalPages: z.number().int().nonnegative(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict()

const completeInterviewSessionEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: z
      .object({
        session: interviewSessionSchema,
        summary: interviewSummarySchema,
      })
      .strict(),
  })
  .strict()

export type CreatedInterviewSession = z.infer<
  typeof createdInterviewSessionSchema
>
export type InterviewSessionRecord = z.infer<typeof interviewSessionSchema>
export type InterviewAnswerRecord = z.infer<typeof interviewAnswerSchema>
export type InterviewEvaluationRecord = NonNullable<
  InterviewAnswerRecord['evaluation']
>
export type EvaluatedInterviewAnswerRecord = z.infer<
  typeof evaluatedInterviewAnswerSchema
>
export type InterviewSummaryRecord = z.infer<typeof interviewSummarySchema>
export type SpeechDeliveryMetricsRecord = z.infer<
  typeof speechDeliveryMetricsSchema
>
export type InterviewSessionListResult = z.infer<
  typeof interviewSessionListEnvelopeSchema
>['data']

const requestTimeoutMs = 60_000
const audioRequestTimeoutMs = 150_000

function accessToken(): string {
  const token = getStoredAccessToken()
  if (!token) {
    throw new AuthApiError(
      'Sesi login tidak ditemukan. Silakan login kembali.',
      401,
    )
  }
  return token
}

async function requestInterviewApi(
  path: string,
  init: RequestInit,
  timeoutMs = requestTimeoutMs,
): Promise<unknown> {
  const token = accessToken()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const { body } = await apiRequest(
      path,
      { ...init, signal: controller.signal },
      token,
      'layanan wawancara',
    )
    return body
  } catch (error) {
    if (controller.signal.aborted) {
      throw new AuthApiError(
        'Permintaan ke layanan wawancara melewati batas waktu. Silakan coba lagi.',
      )
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

function parseResponse<T>(
  body: unknown,
  schema: z.ZodType<T>,
): T {
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw new AuthApiError('Format respons layanan wawancara tidak valid.')
  }
  return parsed.data
}

export async function createInterviewSession(
  jobTitle: string,
): Promise<CreatedInterviewSession> {
  const body = await requestInterviewApi('/api/interview-sessions', {
    method: 'POST',
    body: JSON.stringify({ jobTitle }),
  })
  return parseResponse(body, createInterviewSessionEnvelopeSchema).data
}

export async function submitInterviewAnswer(
  sessionId: string,
  questionId: string,
  answerText: string,
): Promise<EvaluatedInterviewAnswerRecord> {
  const body = await requestInterviewApi(
    `/api/interview-sessions/${encodeURIComponent(sessionId)}/answers`,
    {
      method: 'POST',
      body: JSON.stringify({ questionId, answerText }),
    },
  )
  return parseResponse(body, submitInterviewAnswerEnvelopeSchema).data.answer
}

export async function submitInterviewAudioAnswer(
  sessionId: string,
  questionId: string,
  audio: File,
): Promise<EvaluatedInterviewAnswerRecord> {
  const formData = new FormData()
  formData.append('questionId', questionId)
  formData.append('audio', audio, audio.name)
  const body = await requestInterviewApi(
    `/api/interview-sessions/${encodeURIComponent(sessionId)}/audio-answers`,
    { method: 'POST', body: formData },
    audioRequestTimeoutMs,
  )
  return parseResponse(body, submitInterviewAnswerEnvelopeSchema).data.answer
}

export async function getInterviewSession(
  sessionId: string,
): Promise<InterviewSessionRecord> {
  const body = await requestInterviewApi(
    `/api/interview-sessions/${encodeURIComponent(sessionId)}`,
    { method: 'GET' },
  )
  return parseResponse(body, interviewSessionDetailEnvelopeSchema).data
}

export async function listInterviewSessions(
  page = 1,
  pageSize = 10,
): Promise<InterviewSessionListResult> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })
  const body = await requestInterviewApi(
    `/api/interview-sessions?${query.toString()}`,
    { method: 'GET' },
  )
  return parseResponse(body, interviewSessionListEnvelopeSchema).data
}

export async function completeInterviewSession(
  sessionId: string,
): Promise<{
  session: InterviewSessionRecord
  summary: InterviewSummaryRecord
}> {
  const body = await requestInterviewApi(
    `/api/interview-sessions/${encodeURIComponent(sessionId)}/complete`,
    { method: 'POST' },
  )
  return parseResponse(body, completeInterviewSessionEnvelopeSchema).data
}
