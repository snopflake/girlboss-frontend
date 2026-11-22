export type ApplicationStatus =
  | 'submitted'
  | 'reviewed'
  | 'interview'
  | 'accepted'
  | 'rejected'

/** Tahapan yang tampil pada progres & timeline lamaran. */
export type ApplicationStage = 'submitted' | 'reviewed' | 'interview' | 'decision'

export type ApplicationFilter = 'all' | 'active' | 'accepted' | 'rejected'

export type ApplicationSort = 'newest' | 'oldest' | 'recentlyUpdated'

export interface ApplicationDocument {
  id: string
  fileName: string
  format: string
  sizeLabel: string
}

export interface MyApplication {
  /** ID lamaran yang ditampilkan ke pelamar, mis. GB-261118-042. */
  id: string
  jobId: string
  jobTitle: string
  companyName: string
  companyIndustry: string
  location: string
  employmentType: string
  salaryRange: string | null
  status: ApplicationStatus
  submittedAt: string
  updatedAt: string
  /** Waktu tiap tahapan dicapai; tahapan yang belum dicapai tidak memiliki nilai. */
  stageDates: Partial<Record<ApplicationStage, string>>
  documents: ApplicationDocument[]
  coverLetter: string
}
