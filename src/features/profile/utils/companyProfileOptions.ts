import type { CompanyProfileTab, VerificationStatus } from '../types/companyProfile.types'

export const companyProfileTabs: { value: CompanyProfileTab; label: string }[] = [
  { value: 'info', label: 'Info Perusahaan' },
  { value: 'branding', label: 'Branding & Media' },
  { value: 'verification', label: 'Verifikasi' },
  { value: 'settings', label: 'Pengaturan' },
]

export const industryOptions = [
  'Teknologi & IT',
  'Keuangan & Perbankan',
  'E-Commerce & Ritel',
  'Kesehatan',
  'Pendidikan',
  'Media & Kreatif',
  'Manufaktur',
  'Konsultan & Jasa Profesional',
  'Lainnya',
]

export const companySizeOptions = [
  '1-10 karyawan',
  '11-50 karyawan',
  '51-100 karyawan',
  '100-500 karyawan',
  '500-1000 karyawan',
  'Lebih dari 1000 karyawan',
]

export const verificationLabels: Record<VerificationStatus, string> = {
  unverified: 'Belum Diverifikasi',
  pending: 'Verifikasi Diproses',
  verified: 'Terverifikasi',
  rejected: 'Verifikasi Ditolak',
}
