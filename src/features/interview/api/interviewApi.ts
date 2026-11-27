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
    speechMetrics: z.unknown().optional(),
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

const requestTimeoutMs = 60_000

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
): Promise<unknown> {
  const token = accessToken()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs)

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

export async function getInterviewSession(
  sessionId: string,
): Promise<InterviewSessionRecord> {
  const body = await requestInterviewApi(
    `/api/interview-sessions/${encodeURIComponent(sessionId)}`,
    { method: 'GET' },
  )
  return parseResponse(body, interviewSessionDetailEnvelopeSchema).data
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
