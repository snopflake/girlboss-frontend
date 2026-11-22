import type { ApplicationStatus } from '../types/application.types'
import type { IncomingApplication } from '../types/incomingApplication.types'

/**
 * Data contoh lokal untuk UI "Kelola Lamaran" (company).
 * Backend belum menyediakan endpoint lamaran; data ini fiktif, memakai domain
 * example.com, dan TIDAK mewakili kontrak API apa pun.
 */

interface Seed {
  id: string
  name: string
  emailUser: string
  location: string
  jobId: string
  jobTitle: string
  appliedAt: string
  updatedAt?: string
  status: ApplicationStatus
}

function createApplication(seed: Seed): IncomingApplication {
  const fileSlug = seed.name.replace(/\s+/g, '_')

  return {
    id: seed.id,
    applicantName: seed.name,
    applicantEmail: `${seed.emailUser}@example.com`,
    applicantLocation: seed.location,
    jobId: seed.jobId,
    jobTitle: seed.jobTitle,
    appliedAt: seed.appliedAt,
    updatedAt: seed.updatedAt ?? seed.appliedAt,
    status: seed.status,
    coverLetter: `Yth. Tim Rekrutmen,\nSaya ${seed.name} tertarik melamar posisi ${seed.jobTitle}. Saya memiliki pengalaman dan keahlian yang relevan serta siap berkontribusi untuk tim. Terima kasih atas kesempatan yang diberikan.`,
    documents: [
      { id: `${seed.id}-cv`, fileName: `CV_${fileSlug}.pdf`, format: 'PDF', sizeLabel: '1,1 MB' },
      {
        id: `${seed.id}-portfolio`,
        fileName: `Portofolio_${fileSlug}.pdf`,
        format: 'PDF',
        sizeLabel: '2,4 MB',
      },
    ],
  }
}

export const incomingApplicationsMock: IncomingApplication[] = [
  createApplication({
    id: 'GB-251015-101',
    name: 'Sarah Wijaya',
    emailUser: 'sarah',
    location: 'Jakarta Selatan',
    jobId: 'job-frontend-developer',
    jobTitle: 'Frontend Developer',
    appliedAt: '2025-10-15T09:20:00+07:00',
    updatedAt: '2025-10-16T10:00:00+07:00',
    status: 'reviewed',
  }),
  createApplication({
    id: 'GB-251014-097',
    name: 'Dewi Kartika',
    emailUser: 'dewi',
    location: 'Bandung',
    jobId: 'job-uiux-designer',
    jobTitle: 'UI/UX Designer',
    appliedAt: '2025-10-14T13:05:00+07:00',
    status: 'submitted',
  }),
  createApplication({
    id: 'GB-251013-092',
    name: 'Rani Putri',
    emailUser: 'rani',
    location: 'Jakarta Barat',
    jobId: 'job-frontend-developer',
    jobTitle: 'Frontend Developer',
    appliedAt: '2025-10-13T08:45:00+07:00',
    updatedAt: '2025-10-17T14:00:00+07:00',
    status: 'interview',
  }),
  createApplication({
    id: 'GB-251012-088',
    name: 'Maya Sari',
    emailUser: 'maya',
    location: 'Surabaya',
    jobId: 'job-marketing-manager',
    jobTitle: 'Marketing Manager',
    appliedAt: '2025-10-12T10:30:00+07:00',
    updatedAt: '2025-10-20T09:00:00+07:00',
    status: 'accepted',
  }),
  createApplication({
    id: 'GB-251011-081',
    name: 'Linda Anggraini',
    emailUser: 'linda',
    location: 'Yogyakarta',
    jobId: 'job-data-analyst',
    jobTitle: 'Data Analyst',
    appliedAt: '2025-10-11T16:10:00+07:00',
    updatedAt: '2025-10-18T11:30:00+07:00',
    status: 'rejected',
  }),
  createApplication({
    id: 'GB-251010-077',
    name: 'Ayu Lestari',
    emailUser: 'ayu',
    location: 'Depok',
    jobId: 'job-data-analyst',
    jobTitle: 'Data Analyst',
    appliedAt: '2025-10-10T11:00:00+07:00',
    status: 'submitted',
  }),
  createApplication({
    id: 'GB-251009-072',
    name: 'Nadia Rahma',
    emailUser: 'nadia',
    location: 'Jakarta Pusat',
    jobId: 'job-uiux-designer',
    jobTitle: 'UI/UX Designer',
    appliedAt: '2025-10-09T15:40:00+07:00',
    updatedAt: '2025-10-12T10:20:00+07:00',
    status: 'reviewed',
  }),
  createApplication({
    id: 'GB-251008-066',
    name: 'Putri Maharani',
    emailUser: 'putri',
    location: 'Tangerang',
    jobId: 'job-marketing-manager',
    jobTitle: 'Marketing Manager',
    appliedAt: '2025-10-08T09:15:00+07:00',
    updatedAt: '2025-10-14T13:00:00+07:00',
    status: 'interview',
  }),
  createApplication({
    id: 'GB-251007-061',
    name: 'Indah Permata',
    emailUser: 'indah',
    location: 'Bekasi',
    jobId: 'job-frontend-developer',
    jobTitle: 'Frontend Developer',
    appliedAt: '2025-10-07T14:25:00+07:00',
    updatedAt: '2025-10-10T09:45:00+07:00',
    status: 'rejected',
  }),
  createApplication({
    id: 'GB-251006-055',
    name: 'Fitri Handayani',
    emailUser: 'fitri',
    location: 'Semarang',
    jobId: 'job-data-analyst',
    jobTitle: 'Data Analyst',
    appliedAt: '2025-10-06T10:50:00+07:00',
    updatedAt: '2025-10-15T15:10:00+07:00',
    status: 'accepted',
  }),
  createApplication({
    id: 'GB-251005-049',
    name: 'Citra Ananda',
    emailUser: 'citra',
    location: 'Malang',
    jobId: 'job-uiux-designer',
    jobTitle: 'UI/UX Designer',
    appliedAt: '2025-10-05T08:30:00+07:00',
    status: 'submitted',
  }),
  createApplication({
    id: 'GB-251004-043',
    name: 'Wulan Safitri',
    emailUser: 'wulan',
    location: 'Bogor',
    jobId: 'job-marketing-manager',
    jobTitle: 'Marketing Manager',
    appliedAt: '2025-10-04T17:00:00+07:00',
    updatedAt: '2025-10-08T10:00:00+07:00',
    status: 'reviewed',
  }),
]
