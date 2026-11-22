import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Masukkan alamat email yang valid.'),
  password: z.string().min(1, 'Password wajib diisi.'),
})

export const registerSchema = z
  .object({
    accountType: z.enum(['APPLICANT', 'COMPANY']),
    fullName: z.string().trim().min(1, 'Nama lengkap wajib diisi.'),
    email: z.email('Masukkan alamat email yang valid.'),
    password: z
      .string()
      .min(8, 'Password harus terdiri dari minimal 8 karakter.'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi.'),
    companyName: z.string().optional(),
    acceptedTerms: z.boolean().refine((value) => value, {
      message: 'Persetujuan syarat dan kebijakan privasi wajib dicentang.',
    }),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Konfirmasi password tidak cocok.',
        path: ['confirmPassword'],
      })
    }
    if (value.accountType === 'COMPANY' && !value.companyName?.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Nama perusahaan wajib diisi.',
        path: ['companyName'],
      })
    }
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
