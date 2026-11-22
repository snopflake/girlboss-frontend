import type { ApplicantProfile, ProfileTab } from '../types/applicantProfile.types'

export const profileTabs: { value: ProfileTab; label: string }[] = [
  { value: 'personal', label: 'Info Pribadi' },
  { value: 'experience', label: 'Pengalaman' },
  { value: 'education', label: 'Pendidikan' },
  { value: 'skills', label: 'Keahlian' },
  { value: 'portfolio', label: 'Portofolio' },
  { value: 'settings', label: 'Pengaturan' },
]

export function createLocalId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

/** Persentase kelengkapan profil berdasarkan bagian-bagian utama. */
export function profileCompleteness(profile: ApplicantProfile) {
  const { personal } = profile
  const checks = [
    personal.headline,
    personal.fullName,
    personal.phone,
    personal.address,
    personal.summary,
    profile.experiences.length > 0,
    profile.educations.length > 0,
    profile.skills.length >= 3,
    profile.portfolioLinks.length > 0,
  ]
  const done = checks.filter(Boolean).length
  return Math.round((done / checks.length) * 100)
}
