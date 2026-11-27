import type { ExperienceLevel, JobContext } from '../types/interview'

export const mockJobs: JobContext[] = [
  {
    id: 'job-product-designer',
    title: 'Product Designer',
    company: 'Ruang Tumbuh Digital',
    employmentType: 'Full-time · Hybrid',
  },
  {
    id: 'job-frontend-engineer',
    title: 'Frontend Engineer',
    company: 'Nusa Kreatif',
    employmentType: 'Full-time · Remote',
  },
  {
    id: 'job-people-partner',
    title: 'People & Culture Partner',
    company: 'Bersama Berkarya',
    employmentType: 'Kontrak · On-site',
  },
]

export const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: 'FRESH_GRADUATE', label: 'Fresh Graduate' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MIDDLE', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
]
