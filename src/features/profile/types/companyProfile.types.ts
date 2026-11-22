export interface CompanyInfo {
  companyName: string
  industry: string
  companySize: string
  email: string
  phone: string
  website: string
  address: string
  contactPerson: string
  description: string
  culture: string
  benefits: string
}

export interface CompanySocialLinks {
  linkedin: string
  instagram: string
  twitter: string
  facebook: string
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export interface VerificationDocument {
  id: string
  name: string
  status: 'submitted' | 'approved' | 'rejected'
}

export interface CompanyVerification {
  status: VerificationStatus
  submittedAt: string | null
  estimatedReview: string
  documents: VerificationDocument[]
}

export interface CompanyNotificationPreferences {
  newApplications: boolean
  eventUpdates: boolean
  articleUpdates: boolean
  platformNews: boolean
}

export interface CompanyProfile {
  info: CompanyInfo
  social: CompanySocialLinks
  verification: CompanyVerification
  notifications: CompanyNotificationPreferences
}

export type CompanyProfileTab = 'info' | 'branding' | 'verification' | 'settings'
