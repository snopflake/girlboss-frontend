import type { ApplicantProfile } from '../types/applicantProfile.types'

/**
 * Data contoh lokal untuk UI profil pelamar. Backend belum menyediakan endpoint
 * simpan profil; nama & email diganti dengan data akun yang login (lihat mock
 * service). Data ini TIDAK mewakili kontrak API apa pun.
 */
export const applicantProfileMock: ApplicantProfile = {
  personal: {
    headline: 'Frontend Developer | React & TypeScript Specialist',
    fullName: '',
    email: '',
    phone: '+62 812-3456-7890',
    dateOfBirth: '',
    gender: 'female',
    nationality: 'Indonesia',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan 12190',
    summary: '',
  },
  experiences: [
    {
      id: 'exp-1',
      position: 'Frontend Developer',
      company: 'PT Tech Solutions Indonesia',
      startDate: '2023-02',
      endDate: '',
      isCurrent: true,
      description:
        '• Mengembangkan dashboard internal dengan React & TypeScript\n• Meningkatkan performa halaman utama hingga 40%\n• Membimbing 2 developer junior',
    },
    {
      id: 'exp-2',
      position: 'Junior Frontend Developer',
      company: 'Startup Digital Indonesia',
      startDate: '2020-08',
      endDate: '2023-01',
      isCurrent: false,
      description: '',
    },
  ],
  educations: [
    {
      id: 'edu-1',
      degree: 'S1 Teknik Informatika',
      institution: 'Universitas Indonesia',
      startYear: '2016',
      graduationYear: '2020',
      gpa: '3.75 / 4.00',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services (AWS)',
      issuedAt: '2024-03',
    },
    {
      id: 'cert-2',
      name: 'React Advanced Certification',
      issuer: 'Meta',
      issuedAt: '',
    },
  ],
  skills: [
    'React',
    'TypeScript',
    'JavaScript',
    'Tailwind CSS',
    'Next.js',
    'Git',
    'Problem Solving',
    'Team Collaboration',
  ],
  portfolioLinks: [
    { id: 'link-1', label: 'Personal Website', url: 'https://example.com' },
    { id: 'link-2', label: 'GitHub Profile', url: 'https://github.com/' },
    { id: 'link-3', label: 'LinkedIn Profile', url: 'https://www.linkedin.com/' },
  ],
  preferences: {
    visibility: 'public',
    jobAlerts: 'daily',
    applicationUpdates: true,
    eventNotifications: true,
    articleNotifications: false,
  },
}

export const defaultPreferences = applicantProfileMock.preferences
