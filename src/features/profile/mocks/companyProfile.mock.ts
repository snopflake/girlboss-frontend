import type { CompanyNotificationPreferences, CompanyProfile } from '../types/companyProfile.types'

/**
 * Data contoh lokal untuk UI profil perusahaan. Backend belum menyediakan
 * endpoint simpan profil perusahaan; email & nama kontak diganti dengan data
 * akun yang login (lihat mock service). TIDAK mewakili kontrak API apa pun.
 */

export const defaultCompanyNotifications: CompanyNotificationPreferences = {
  newApplications: true,
  eventUpdates: true,
  articleUpdates: true,
  platformNews: false,
}

export const companyProfileMock: CompanyProfile = {
  info: {
    companyName: 'PT Tech Indonesia',
    industry: 'Teknologi & IT',
    companySize: '100-500 karyawan',
    email: '',
    phone: '+62 21-1234-5678',
    website: '',
    address: 'Jl. Jenderal Sudirman Kav. 52-53, SCBD, Jakarta Selatan 12190, Indonesia',
    contactPerson: '',
    description: '',
    culture: '',
    benefits: '',
  },
  social: {
    linkedin: '',
    instagram: '',
    twitter: '',
    facebook: '',
  },
  verification: {
    status: 'pending',
    submittedAt: '2026-11-15T10:00:00+07:00',
    estimatedReview: '2-3 hari kerja',
    documents: [
      { id: 'doc-siup', name: 'Surat Izin Usaha Perdagangan (SIUP)', status: 'submitted' },
      { id: 'doc-npwp', name: 'Nomor Pokok Wajib Pajak (NPWP)', status: 'submitted' },
      { id: 'doc-profile', name: 'Dokumen Profil Perusahaan', status: 'submitted' },
    ],
  },
  notifications: defaultCompanyNotifications,
}
