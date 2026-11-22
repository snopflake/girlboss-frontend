import type { ApplicantProfile } from '../types/applicantProfile.types'
import { applicantProfileMock } from './applicantProfile.mock'

/**
 * Sumber data sementara untuk profil pelamar selama backend belum memiliki
 * endpoint simpan profil. Data disimpan di memori per pengguna (hilang saat
 * reload). Saat endpoint tersedia, ganti pemanggilan di
 * `hooks/useApplicantProfile.ts` ke modul `api/` tanpa mengubah komponen UI.
 *
 * Mode pratinjau (hanya saat development): ?mock=error
 */

const latencyMs = 400

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, latencyMs))
}

function isErrorScenario() {
  return (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('mock') === 'error'
  )
}

export class MockProfileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MockProfileError'
  }
}

const store = new Map<string, ApplicantProfile>()

interface AccountSeed {
  userId: string
  fullName: string | null
  email: string | null
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

export async function getApplicantProfileMock(seed: AccountSeed): Promise<ApplicantProfile> {
  await wait()
  if (isErrorScenario()) {
    throw new MockProfileError('Profil tidak dapat dimuat.')
  }

  let profile = store.get(seed.userId)
  if (!profile) {
    profile = clone(applicantProfileMock)
    // Nama & email berasal dari akun yang sedang login (data asli).
    profile.personal.fullName = seed.fullName ?? ''
    profile.personal.email = seed.email ?? ''
    store.set(seed.userId, profile)
  }
  return clone(profile)
}

export async function saveApplicantProfileMock(input: {
  userId: string
  changes: Partial<ApplicantProfile>
}): Promise<ApplicantProfile> {
  await wait()
  const current = store.get(input.userId)
  if (!current) throw new MockProfileError('Profil tidak ditemukan.')

  const next: ApplicantProfile = { ...current, ...clone(input.changes) }
  // Email mengikuti akun login dan tidak dapat diubah dari halaman profil.
  next.personal = { ...next.personal, email: current.personal.email }
  store.set(input.userId, next)
  return clone(next)
}
