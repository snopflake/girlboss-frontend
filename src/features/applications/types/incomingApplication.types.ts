import type { ApplicationDocument, ApplicationStatus } from './application.types'

/** Lamaran yang diterima perusahaan, dilihat dari sisi company. */
export interface IncomingApplication {
  id: string
  applicantName: string
  applicantEmail: string
  applicantLocation: string
  jobId: string
  jobTitle: string
  appliedAt: string
  updatedAt: string
  status: ApplicationStatus
  coverLetter: string
  documents: ApplicationDocument[]
}

export type IncomingStatusFilter = ApplicationStatus | 'all'
