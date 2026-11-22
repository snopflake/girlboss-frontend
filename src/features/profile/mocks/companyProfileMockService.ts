import type { CompanyProfile } from '../types/companyProfile.types'
import { companyProfileMock } from './companyProfile.mock'

/**
 * Sumber data sementara untuk profil perusahaan selama backend belum memiliki
 * endpoint simpan profil perusahaan. Data disimpan di memori per pengguna
 * (hilang saat reload). Saat endpoint tersedia, ganti pemanggilan di
 * `hooks/useCompanyProfile.ts` ke modul `api/` tanpa mengubah komponen UI.
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

export class MockCompanyProfileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MockCompanyProfileError'
  }
}

const store = new Map<string, CompanyProfile>()

interface AccountSeed {
  userId: string
  fullName: string | null
  email: string | null
}

export async function getCompanyProfileMock(seed: AccountSeed): Promise<CompanyProfile> {
  await wait()
  if (isErrorScenario()) {
    throw new MockCompanyProfileError('Profil perusahaan tidak dapat dimuat.')
  }

  let profile = store.get(seed.userId)
  if (!profile) {
    profile = structuredClone(companyProfileMock)
    // Email & nama kontak berasal dari akun yang sedang login (data asli).
    profile.info.email = seed.email ?? ''
    profile.info.contactPerson = seed.fullName ?? ''
    store.set(seed.userId, profile)
  }
  return structuredClone(profile)
}

export async function saveCompanyProfileMock(input: {
  userId: string
  changes: Partial<Pick<CompanyProfile, 'info' | 'social' | 'notifications'>>
}): Promise<CompanyProfile> {
  await wait()
  const current = store.get(input.userId)
  if (!current) throw new MockCompanyProfileError('Profil perusahaan tidak ditemukan.')

  const next: CompanyProfile = { ...current, ...structuredClone(input.changes) }
  // Email mengikuti akun login; status verifikasi hanya diubah oleh admin.
  next.info = { ...next.info, email: current.info.email }
  next.verification = current.verification
  store.set(input.userId, next)
  return structuredClone(next)
}
