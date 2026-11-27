import { z } from 'zod'

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:4000'
).replace(/\/+$/, '')

export const authSessionStorageKey = 'girlboss.auth.access-token'

export function getStoredAccessToken(): string | null {
  return typeof window === 'undefined'
    ? null
    : window.sessionStorage.getItem(authSessionStorageKey)
}

const roleSchema = z.enum(['APPLICANT', 'COMPANY', 'ADMIN'])
const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  fullName: z.string(),
  role: roleSchema,
  accountStatus: z.string(),
})

const loginEnvelopeSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    user: userSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
  }),
})

const currentUserEnvelopeSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: userSchema.extend({
    profile: z.record(z.string(), z.string().nullable()),
  }),
})

const genericEnvelopeSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.unknown(),
})

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
  accountType: 'APPLICANT'
}

export interface CompanyRegisterPayload {
  fullName: string
  email: string
  password: string
  accountType: 'COMPANY'
  companyName: string
}

export type AuthenticatedUserData = z.infer<typeof userSchema>
export type ApplicationRole = z.infer<typeof roleSchema>

export class AuthApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
  }
}

export async function apiRequest(
  path: string,
  init: RequestInit,
  accessToken?: string,
  serviceName = 'backend',
): Promise<{ response: Response; body: unknown }> {
  let response: Response
  try {
    const headers = new Headers(init.headers)
    headers.set('Accept', 'application/json')
    const isFormData =
      typeof FormData !== 'undefined' && init.body instanceof FormData
    if (init.body && !isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers,
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new AuthApiError(
        `Tidak dapat terhubung ke ${serviceName}. Periksa koneksi dan coba lagi.`,
      )
    }
    throw error
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new AuthApiError(
      `Respons ${serviceName} tidak dapat dibaca.`,
      response.status,
    )
  }

  if (!response.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : `Permintaan ke ${serviceName} tidak dapat diproses.`

    throw new AuthApiError(message, response.status)
  }

  return { response, body }
}

async function request(
  path: string,
  init: RequestInit,
): Promise<{ response: Response; body: unknown }> {
  return apiRequest(path, init, undefined, 'layanan autentikasi')
}

function parseSuccess<T>(
  body: unknown,
  schema: z.ZodType<T>,
): T {
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw new AuthApiError('Format respons layanan autentikasi tidak valid.')
  }
  return parsed.data
}

export async function registerWithApi(
  payload: RegisterPayload | CompanyRegisterPayload,
): Promise<string> {
  const { body } = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return parseSuccess(body, genericEnvelopeSchema).message
}

export async function loginWithApi(email: string, password: string) {
  const { body } = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return parseSuccess(body, loginEnvelopeSchema).data
}

export async function getCurrentUser(accessToken: string) {
  const { body } = await request('/api/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return parseSuccess(body, currentUserEnvelopeSchema).data
}
