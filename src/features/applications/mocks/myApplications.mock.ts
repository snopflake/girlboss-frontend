import type {
  ApplicationDocument,
  ApplicationStage,
  ApplicationStatus,
  MyApplication,
} from '../types/application.types'

/**
 * Data contoh lokal untuk UI "Lamaran Saya".
 * Backend belum menyediakan endpoint lamaran, sehingga data ini hanya dipakai
 * oleh mock service dan TIDAK mewakili kontrak API apa pun.
 */

const defaultDocuments: ApplicationDocument[] = [
  { id: 'doc-cv', fileName: 'CV_Anisa_Putri.pdf', format: 'PDF', sizeLabel: '1,2 MB' },
  {
    id: 'doc-portfolio',
    fileName: 'Portofolio_Anisa_Putri.pdf',
    format: 'PDF',
    sizeLabel: '1,2 MB',
  },
]

function coverLetterFor(companyName: string, jobTitle: string) {
  return `Yth. Tim Rekrutmen ${companyName},\nSaya tertarik melamar posisi ${jobTitle}. Dengan pengalaman dan keahlian yang relevan, saya siap berkontribusi untuk mendukung tujuan perusahaan. Saya berharap dapat berdiskusi lebih lanjut mengenai kontribusi yang dapat saya berikan. Terima kasih atas waktu dan kesempatan yang diberikan, saya menantikan kabar baik dari Bapak/Ibu.`
}

interface MockSeed {
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  companyIndustry: string
  location: string
  employmentType: string
  salaryRange: string | null
  status: ApplicationStatus
  stageDates: Partial<Record<ApplicationStage, string>>
}

function createApplication(seed: MockSeed): MyApplication {
  const dates = Object.values(seed.stageDates).filter(Boolean) as string[]
  const updatedAt = dates.sort().at(-1) ?? seed.stageDates.submitted ?? ''

  return {
    ...seed,
    submittedAt: seed.stageDates.submitted ?? updatedAt,
    updatedAt,
    documents: defaultDocuments,
    coverLetter: coverLetterFor(seed.companyName, seed.jobTitle),
  }
}

export const myApplicationsMock: MyApplication[] = [
  createApplication({
    id: 'GB-261118-031',
    jobId: 'job-uiux-designer',
    jobTitle: 'UI/UX Designer',
    companyName: 'PT Teknologi Nusantara',
    companyIndustry: 'Teknologi Informasi',
    location: 'Jakarta Selatan',
    employmentType: 'Full-time',
    salaryRange: 'Rp 10–15 juta/bulan',
    status: 'interview',
    stageDates: {
      submitted: '2026-11-18T09:12:00+07:00',
      reviewed: '2026-11-19T10:30:00+07:00',
      interview: '2026-11-20T14:00:00+07:00',
    },
  }),
  createApplication({
    id: 'GB-261118-036',
    jobId: 'job-frontend-developer',
    jobTitle: 'Frontend Developer',
    companyName: 'PT Digital Indonesia',
    companyIndustry: 'Teknologi Informasi',
    location: 'Jakarta Selatan',
    employmentType: 'Full-time',
    salaryRange: 'Rp 12–18 juta/bulan',
    status: 'reviewed',
    stageDates: {
      submitted: '2026-11-18T08:40:00+07:00',
      reviewed: '2026-11-20T11:15:00+07:00',
    },
  }),
  createApplication({
    id: 'GB-261118-042',
    jobId: 'job-content-writer',
    jobTitle: 'Content Writer',
    companyName: 'Media Digital',
    companyIndustry: 'Media & Komunikasi',
    location: 'Jakarta Selatan',
    employmentType: 'Full-time',
    salaryRange: 'Rp 8–12 juta/bulan',
    status: 'submitted',
    stageDates: { submitted: '2026-11-18T09:12:00+07:00' },
  }),
  createApplication({
    id: 'GB-261110-018',
    jobId: 'job-marketing-manager',
    jobTitle: 'Marketing Manager',
    companyName: 'E-Commerce Giant',
    companyIndustry: 'E-Commerce',
    location: 'Jakarta Barat',
    employmentType: 'Full-time',
    salaryRange: 'Rp 18–25 juta/bulan',
    status: 'accepted',
    stageDates: {
      submitted: '2026-11-10T10:00:00+07:00',
      reviewed: '2026-11-12T09:00:00+07:00',
      interview: '2026-11-15T13:00:00+07:00',
      decision: '2026-11-19T16:20:00+07:00',
    },
  }),
  createApplication({
    id: 'GB-261108-011',
    jobId: 'job-data-analyst',
    jobTitle: 'Data Analyst',
    companyName: 'FinTech Startup',
    companyIndustry: 'Layanan Keuangan',
    location: 'Bandung',
    employmentType: 'Full-time',
    salaryRange: 'Rp 9–13 juta/bulan',
    status: 'rejected',
    stageDates: {
      submitted: '2026-11-08T15:45:00+07:00',
      reviewed: '2026-11-11T10:00:00+07:00',
      interview: '2026-11-14T10:00:00+07:00',
      decision: '2026-11-20T09:30:00+07:00',
    },
  }),
  createApplication({
    id: 'GB-261117-027',
    jobId: 'job-product-manager',
    jobTitle: 'Product Manager',
    companyName: 'PT Solusi Kreatif',
    companyIndustry: 'Teknologi Informasi',
    location: 'Remote',
    employmentType: 'Full-time',
    salaryRange: 'Rp 20–28 juta/bulan',
    status: 'submitted',
    stageDates: { submitted: '2026-11-17T13:20:00+07:00' },
  }),
  createApplication({
    id: 'GB-261116-024',
    jobId: 'job-hr-specialist',
    jobTitle: 'HR Specialist',
    companyName: 'Bank Sejahtera',
    companyIndustry: 'Perbankan',
    location: 'Jakarta Pusat',
    employmentType: 'Full-time',
    salaryRange: null,
    status: 'reviewed',
    stageDates: {
      submitted: '2026-11-16T09:05:00+07:00',
      reviewed: '2026-11-18T15:40:00+07:00',
    },
  }),
  createApplication({
    id: 'GB-261114-021',
    jobId: 'job-graphic-designer',
    jobTitle: 'Graphic Designer',
    companyName: 'Studio Warna',
    companyIndustry: 'Industri Kreatif',
    location: 'Yogyakarta',
    employmentType: 'Kontrak',
    salaryRange: 'Rp 6–9 juta/bulan',
    status: 'interview',
    stageDates: {
      submitted: '2026-11-14T11:00:00+07:00',
      reviewed: '2026-11-16T10:00:00+07:00',
      interview: '2026-11-21T09:00:00+07:00',
    },
  }),
  createApplication({
    id: 'GB-261112-019',
    jobId: 'job-social-media',
    jobTitle: 'Social Media Specialist',
    companyName: 'Brand Lokal Indonesia',
    companyIndustry: 'Ritel',
    location: 'Surabaya',
    employmentType: 'Part-time',
    salaryRange: 'Rp 4–6 juta/bulan',
    status: 'submitted',
    stageDates: { submitted: '2026-11-12T19:30:00+07:00' },
  }),
  createApplication({
    id: 'GB-261105-008',
    jobId: 'job-qa-engineer',
    jobTitle: 'QA Engineer',
    companyName: 'PT Digital Indonesia',
    companyIndustry: 'Teknologi Informasi',
    location: 'Jakarta Selatan',
    employmentType: 'Full-time',
    salaryRange: 'Rp 10–14 juta/bulan',
    status: 'accepted',
    stageDates: {
      submitted: '2026-11-05T08:00:00+07:00',
      reviewed: '2026-11-07T13:00:00+07:00',
      interview: '2026-11-11T10:00:00+07:00',
      decision: '2026-11-17T11:00:00+07:00',
    },
  }),
  createApplication({
    id: 'GB-261103-005',
    jobId: 'job-business-analyst',
    jobTitle: 'Business Analyst',
    companyName: 'Konsultan Prima',
    companyIndustry: 'Konsultan Bisnis',
    location: 'Jakarta Pusat',
    employmentType: 'Full-time',
    salaryRange: 'Rp 12–16 juta/bulan',
    status: 'rejected',
    stageDates: {
      submitted: '2026-11-03T10:10:00+07:00',
      reviewed: '2026-11-06T09:00:00+07:00',
      decision: '2026-11-13T14:00:00+07:00',
    },
  }),
  createApplication({
    id: 'GB-261101-002',
    jobId: 'job-copywriter',
    jobTitle: 'Copywriter',
    companyName: 'Agensi Cerita',
    companyIndustry: 'Periklanan',
    location: 'Remote',
    employmentType: 'Freelance',
    salaryRange: null,
    status: 'rejected',
    stageDates: {
      submitted: '2026-11-01T16:00:00+07:00',
      decision: '2026-11-09T10:00:00+07:00',
    },
  }),
]
