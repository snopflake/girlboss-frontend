export type Gender = '' | 'female' | 'prefer-not-to-say'

export interface PersonalInfo {
  headline: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: Gender
  nationality: string
  address: string
  summary: string
}

export interface WorkExperience {
  id: string
  position: string
  company: string
  /** Format YYYY-MM (input type="month"). */
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  startYear: string
  graduationYear: string
  gpa: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  /** Format YYYY-MM. */
  issuedAt: string
}

export interface PortfolioLink {
  id: string
  label: string
  url: string
}

export type ProfileVisibility = 'public' | 'employers' | 'private'
export type JobAlertFrequency = 'daily' | 'weekly' | 'off'

export interface ProfilePreferences {
  visibility: ProfileVisibility
  jobAlerts: JobAlertFrequency
  applicationUpdates: boolean
  eventNotifications: boolean
  articleNotifications: boolean
}

export interface ApplicantProfile {
  personal: PersonalInfo
  experiences: WorkExperience[]
  educations: Education[]
  certifications: Certification[]
  skills: string[]
  portfolioLinks: PortfolioLink[]
  preferences: ProfilePreferences
}

export type ProfileTab =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'portfolio'
  | 'settings'
