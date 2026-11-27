import { z } from 'zod'
import {
  apiRequest,
  AuthApiError,
  getStoredAccessToken,
} from '../../auth/api/authApi'
import type { CvAnalysisResult, CvDocument } from '../types/cvAnalyzer'

const cvMetadataSchema = z
  .object({
    id: z.uuid(),
    fileName: z.string().min(1),
    fileSize: z.number().int().nonnegative(),
    mimeType: z.enum([
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]),
  })
  .strict()

const cvListEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: z.object({ cvs: z.array(cvMetadataSchema) }).strict(),
  })
  .strict()

const cvUploadEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: cvMetadataSchema,
  })
  .strict()

const cvAnalysisResultSchema = z
  .object({
    score: z.number().int().min(0).max(100),
    summary: z.string().min(1),
    strengths: z.array(z.string().min(1)),
    weaknesses: z.array(z.string().min(1)),
    recommendations: z.array(z.string().min(1)),
  })
  .strict()

const cvAnalysisRecordSchema = z
  .object({
    id: z.uuid(),
    cvId: z.uuid(),
    status: z.enum(['PROCESSING', 'COMPLETED', 'FAILED']),
    requestedAt: z.string(),
    result: cvAnalysisResultSchema.nullable(),
  })
  .strict()

const cvAnalysisEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: cvAnalysisRecordSchema,
  })
  .strict()

const cvAnalysisListEnvelopeSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    data: z
      .object({
        analyses: z.array(cvAnalysisRecordSchema),
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

function accessToken(): string {
  const token = getStoredAccessToken()
  if (!token) {
    throw new AuthApiError('Sesi login tidak ditemukan. Silakan login kembali.', 401)
  }
  return token
}

function parseResponse<T>(body: unknown, schema: z.ZodType<T>): T {
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw new AuthApiError('Format respons CV Analyzer tidak valid.')
  }
  return parsed.data
}

function toCvDocument(metadata: z.infer<typeof cvMetadataSchema>): CvDocument {
  return {
    id: metadata.id,
    name: metadata.fileName,
    format: metadata.mimeType === 'application/pdf' ? 'PDF' : 'DOCX',
    size: metadata.fileSize,
  }
}

export async function listApplicantCvs(): Promise<CvDocument[]> {
  const { body } = await apiRequest(
    '/api/applicant/cvs',
    { method: 'GET' },
    accessToken(),
    'layanan CV',
  )
  const response = parseResponse(body, cvListEnvelopeSchema)
  return response.data.cvs.map(toCvDocument)
}

export async function uploadApplicantCv(file: File): Promise<CvDocument> {
  const formData = new FormData()
  formData.append('file', file)

  const { body } = await apiRequest(
    '/api/applicant/cvs',
    { method: 'POST', body: formData },
    accessToken(),
    'layanan CV',
  )
  const response = parseResponse(body, cvUploadEnvelopeSchema)
  return toCvDocument(response.data)
}

export interface CvAnalysisResponse {
  id: string
  cvId: string
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  requestedAt: string
  result: CvAnalysisResult | null
}

export interface CvAnalysisHistoryPage {
  analyses: CvAnalysisResponse[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function listCvAnalyses(
  page = 1,
  pageSize = 10,
): Promise<CvAnalysisHistoryPage> {
  const { body } = await apiRequest(
    `/api/cv-analyses?page=${page}&pageSize=${pageSize}`,
    { method: 'GET' },
    accessToken(),
    'layanan CV Analyzer',
  )
  const response = parseResponse(body, cvAnalysisListEnvelopeSchema)
  return response.data
}

export async function getCvAnalysis(
  id: string,
): Promise<CvAnalysisResponse> {
  const { body } = await apiRequest(
    `/api/cv-analyses/${encodeURIComponent(id)}`,
    { method: 'GET' },
    accessToken(),
    'layanan CV Analyzer',
  )
  const response = parseResponse(body, cvAnalysisEnvelopeSchema)
  return response.data
}

export async function createCvAnalysis(
  cvId: string,
): Promise<CvAnalysisResponse> {
  const { body } = await apiRequest(
    '/api/cv-analyses',
    {
      method: 'POST',
      body: JSON.stringify({ cvId }),
    },
    accessToken(),
    'layanan CV Analyzer',
  )
  const response = parseResponse(body, cvAnalysisEnvelopeSchema)
  return response.data
}
