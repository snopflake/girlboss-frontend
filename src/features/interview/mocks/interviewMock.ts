import type {
  ExperienceLevel,
  InterviewFeedback,
  InterviewQuestion,
  InterviewSession,
  JobContext,
  WorkContext,
} from '../types/interview'

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

const questionTemplates = [
  {
    id: 'introduction',
    category: 'Perkenalan',
    prompt:
      'Ceritakan tentang diri Anda dan pengalaman yang paling relevan dengan posisi ini.',
  },
  {
    id: 'challenge',
    category: 'Pemecahan masalah',
    prompt:
      'Ceritakan situasi ketika Anda menghadapi tantangan besar di pekerjaan. Apa tindakan dan hasilnya?',
  },
  {
    id: 'collaboration',
    category: 'Kolaborasi',
    prompt:
      'Bagaimana Anda bekerja sama dengan rekan yang memiliki sudut pandang berbeda?',
  },
  {
    id: 'impact',
    category: 'Dampak kerja',
    prompt:
      'Pencapaian apa yang paling Anda banggakan, dan bagaimana Anda mengukur keberhasilannya?',
  },
  {
    id: 'motivation',
    category: 'Motivasi',
    prompt:
      'Apa yang membuat Anda tertarik pada posisi dan lingkungan kerja ini?',
  },
]

export function createInterviewQuestions(): InterviewQuestion[] {
  return questionTemplates.map((question) => ({
    ...question,
    status: 'UNANSWERED',
    answer: '',
  }))
}

export function createMockFeedback(): InterviewFeedback {
  return {
    relevance:
      'Jawaban sudah menanggapi inti pertanyaan dan menyebutkan pengalaman yang relevan.',
    clarity:
      'Alur jawaban cukup mudah diikuti. Pemisahan situasi, tindakan, dan hasil dapat dibuat lebih tegas.',
    completeness:
      'Jawaban memuat konteks dan tindakan. Dampak yang terukur akan membuat ceritanya lebih lengkap.',
    recommendation:
      'Coba susun jawaban dengan metode STAR dan tambahkan hasil konkret dari tindakan Anda.',
  }
}

function createQuestion(
  id: string,
  prompt: string,
  status: InterviewQuestion['status'],
  answer = '',
  feedback?: InterviewFeedback,
): InterviewQuestion {
  return {
    id,
    prompt,
    category: 'Latihan umum',
    status,
    answer,
    feedback,
  }
}

const mockContext: WorkContext = {
  source: 'JOB',
  title: 'Product Designer',
  company: 'Ruang Tumbuh Digital',
  employmentType: 'Full-time · Hybrid',
  experienceLevel: 'MIDDLE',
  description: '',
}

const mockStartedAt = new Date(Date.now() - 13 * 60 * 1000).toISOString()

const completedQuestions = [
  createQuestion(
    'mock-introduction',
    'Ceritakan tentang diri Anda dan pengalaman yang paling relevan dengan posisi ini.',
    'ANSWERED',
    'Saya memiliki pengalaman merancang produk digital dan berkolaborasi dengan tim lintas fungsi untuk menyelesaikan masalah pengguna.',
    createMockFeedback(),
  ),
  createQuestion(
    'mock-challenge',
    'Ceritakan tantangan yang pernah Anda hadapi di pekerjaan.',
    'SKIPPED',
  ),
]

export const initialInterviewSessions: InterviewSession[] = [
  {
    id: 'mock-session-completed',
    context: mockContext,
    status: 'COMPLETED',
    startedAt: mockStartedAt,
    endedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    elapsedSeconds: 540,
    currentQuestionIndex: 1,
    questions: completedQuestions,
  },
  {
    id: 'mock-session-active',
    context: {
      ...mockContext,
      title: 'Frontend Engineer',
      company: 'Nusa Kreatif',
      employmentType: 'Full-time · Remote',
    },
    status: 'IN_PROGRESS',
    startedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    elapsedSeconds: 120,
    currentQuestionIndex: 0,
    questions: createInterviewQuestions(),
  },
  {
    id: 'mock-session-cancelled',
    context: {
      ...mockContext,
      title: 'People & Culture Partner',
      company: 'Bersama Berkarya',
      employmentType: 'Kontrak · On-site',
    },
    status: 'CANCELLED',
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60_000).toISOString(),
    elapsedSeconds: 60,
    currentQuestionIndex: 0,
    questions: createInterviewQuestions(),
  },
]
