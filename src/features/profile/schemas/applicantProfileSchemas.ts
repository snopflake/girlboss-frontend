import { z } from 'zod'

const optionalText = z.string().trim().max(500)

export const personalInfoSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(1, 'Headline profesional wajib diisi.')
    .max(120, 'Headline maksimal 120 karakter.'),
  fullName: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter.')
    .max(100, 'Nama lengkap maksimal 100 karakter.'),
  email: z.email(),
  phone: z
    .string()
    .trim()
    .min(1, 'Nomor telepon wajib diisi.')
    .regex(/^\+?[0-9\s-]{8,20}$/, 'Gunakan format nomor telepon yang valid, mis. +62 812-3456-7890.'),
  dateOfBirth: z.string(),
  gender: z.enum(['', 'female', 'prefer-not-to-say']),
  nationality: z.string().trim().max(60),
  address: z.string().trim().max(300, 'Alamat maksimal 300 karakter.'),
  summary: z.string().trim().max(1500, 'Ringkasan maksimal 1.500 karakter.'),
})

export const experienceListSchema = z.object({
  items: z.array(
    z
      .object({
        id: z.string(),
        position: z.string().trim().min(1, 'Posisi wajib diisi.'),
        company: z.string().trim().min(1, 'Nama perusahaan wajib diisi.'),
        startDate: z.string().min(1, 'Tanggal mulai wajib diisi.'),
        endDate: z.string(),
        isCurrent: z.boolean(),
        description: z.string().trim().max(2000, 'Deskripsi maksimal 2.000 karakter.'),
      })
      .refine((item) => item.isCurrent || item.endDate !== '', {
        message: 'Isi tanggal selesai atau tandai sebagai pekerjaan saat ini.',
        path: ['endDate'],
      })
      .refine((item) => item.isCurrent || !item.endDate || item.endDate >= item.startDate, {
        message: 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
        path: ['endDate'],
      }),
  ),
})

const yearPattern = /^(19|20)\d{2}$/

export const educationListSchema = z.object({
  educations: z.array(
    z
      .object({
        id: z.string(),
        degree: z.string().trim().min(1, 'Gelar/jurusan wajib diisi.'),
        institution: z.string().trim().min(1, 'Nama institusi wajib diisi.'),
        startYear: z.string().regex(yearPattern, 'Tahun tidak valid.'),
        graduationYear: z.string().regex(yearPattern, 'Tahun tidak valid.'),
        gpa: optionalText,
      })
      .refine((item) => item.graduationYear >= item.startYear, {
        message: 'Tahun lulus tidak boleh sebelum tahun mulai.',
        path: ['graduationYear'],
      }),
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string().trim().min(1, 'Nama sertifikasi wajib diisi.'),
      issuer: z.string().trim().min(1, 'Penerbit wajib diisi.'),
      issuedAt: z.string(),
    }),
  ),
})

export const portfolioListSchema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      label: z.string().trim().min(1, 'Nama tautan wajib diisi.').max(60),
      url: z.url({ protocol: /^https?$/, error: 'Masukkan URL yang valid (diawali https://).' }),
    }),
  ),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password saat ini wajib diisi.'),
    newPassword: z
      .string()
      .min(8, 'Password minimal 8 karakter.')
      .regex(/[A-Za-z]/, 'Password harus mengandung huruf.')
      .regex(/[0-9]/, 'Password harus mengandung angka.'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi.'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Konfirmasi password tidak sama.',
    path: ['confirmPassword'],
  })
  .refine((value) => value.newPassword !== value.currentPassword, {
    message: 'Password baru harus berbeda dari password saat ini.',
    path: ['newPassword'],
  })

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>
export type ExperienceListValues = z.infer<typeof experienceListSchema>
export type EducationListValues = z.infer<typeof educationListSchema>
export type PortfolioListValues = z.infer<typeof portfolioListSchema>
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>
