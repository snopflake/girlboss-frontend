import { z } from 'zod'

const optionalUrl = z.union([
  z.literal(''),
  z.url({ protocol: /^https?$/, error: 'Masukkan URL yang valid (diawali https://).' }),
])

export const companyInfoSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, 'Nama perusahaan minimal 2 karakter.')
    .max(120, 'Nama perusahaan maksimal 120 karakter.'),
  industry: z.string().min(1, 'Pilih sektor industri.'),
  companySize: z.string().min(1, 'Pilih ukuran perusahaan.'),
  email: z.email(),
  phone: z
    .string()
    .trim()
    .min(1, 'Nomor telepon wajib diisi.')
    .regex(/^\+?[0-9\s-]{8,20}$/, 'Gunakan format nomor telepon yang valid, mis. +62 21-1234-5678.'),
  website: optionalUrl,
  address: z
    .string()
    .trim()
    .min(1, 'Lokasi kantor utama wajib diisi.')
    .max(300, 'Alamat maksimal 300 karakter.'),
  contactPerson: z.string().trim().max(100),
  description: z
    .string()
    .trim()
    .min(30, 'Deskripsi perusahaan minimal 30 karakter.')
    .max(3000, 'Deskripsi maksimal 3.000 karakter.'),
  culture: z.string().trim().max(2000, 'Maksimal 2.000 karakter.'),
  benefits: z.string().trim().max(2000, 'Maksimal 2.000 karakter.'),
})

export const companySocialSchema = z.object({
  linkedin: optionalUrl,
  instagram: optionalUrl,
  twitter: optionalUrl,
  facebook: optionalUrl,
})

export type CompanyInfoValues = z.infer<typeof companyInfoSchema>
export type CompanySocialValues = z.infer<typeof companySocialSchema>
