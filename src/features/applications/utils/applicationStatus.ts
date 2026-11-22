import type {
  ApplicationFilter,
  ApplicationStage,
  ApplicationStatus,
  MyApplication,
} from '../types/application.types'

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  submitted: 'Terkirim',
  reviewed: 'Ditinjau',
  interview: 'Wawancara',
  accepted: 'Diterima',
  rejected: 'Ditolak',
}

export const applicationStages: ApplicationStage[] = [
  'submitted',
  'reviewed',
  'interview',
  'decision',
]

export const applicationStageShortLabels: Record<ApplicationStage, string> = {
  submitted: 'Terkirim',
  reviewed: 'Ditinjau',
  interview: 'Wawancara',
  decision: 'Keputusan',
}

export const applicationStageTimelineLabels: Record<ApplicationStage, string> = {
  submitted: 'Lamaran Terkirim',
  reviewed: 'Ditinjau Perusahaan',
  interview: 'Tahap Wawancara',
  decision: 'Keputusan Akhir',
}

export const applicationStatusMessages: Record<ApplicationStatus, string> = {
  submitted: 'Lamaranmu sudah diterima sistem dan menunggu ditinjau.',
  reviewed: 'Perusahaan sedang meninjau lamaranmu.',
  interview: 'Kamu masuk tahap wawancara. Persiapkan dirimu dengan baik!',
  accepted: 'Selamat! Lamaranmu diterima oleh perusahaan.',
  rejected:
    'Lamaranmu belum berhasil kali ini. Tetap semangat dan coba peluang lainnya.',
}

/** Indeks tahapan terakhir yang sudah dicapai oleh lamaran. */
export function getStageIndex(status: ApplicationStatus) {
  switch (status) {
    case 'submitted':
      return 0
    case 'reviewed':
      return 1
    case 'interview':
      return 2
    case 'accepted':
    case 'rejected':
      return 3
  }
}

export function isActiveStatus(status: ApplicationStatus) {
  return status === 'submitted' || status === 'reviewed' || status === 'interview'
}

/** Lamaran hanya dapat dibatalkan sebelum masuk tahap wawancara. */
export function canCancelApplication(status: ApplicationStatus) {
  return status === 'submitted' || status === 'reviewed'
}

export function matchesFilter(
  application: MyApplication,
  filter: ApplicationFilter,
) {
  switch (filter) {
    case 'all':
      return true
    case 'active':
      return isActiveStatus(application.status)
    case 'accepted':
      return application.status === 'accepted'
    case 'rejected':
      return application.status === 'rejected'
  }
}

export function summarizeApplications(applications: MyApplication[]) {
  return {
    total: applications.length,
    active: applications.filter((item) => isActiveStatus(item.status)).length,
    accepted: applications.filter((item) => item.status === 'accepted').length,
    rejected: applications.filter((item) => item.status === 'rejected').length,
  }
}
