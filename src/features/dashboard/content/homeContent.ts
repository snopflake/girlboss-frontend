import { BriefcaseBusiness, ShieldCheck, Star, TrendingUp, Users, type LucideIcon } from 'lucide-react'

export interface HomeFeature {
  icon: LucideIcon
  title: string
  description: string
}

export interface HomeStat {
  icon: LucideIcon
  value: string
  label: string
}

export const homeFeatures: HomeFeature[] = [
  {
    icon: BriefcaseBusiness,
    title: 'Lowongan Khusus Perempuan',
    description:
      'Akses ribuan lowongan dari perusahaan yang mendukung kesetaraan gender dan pemberdayaan perempuan.',
  },
  {
    icon: ShieldCheck,
    title: 'Lingkungan Aman',
    description:
      'Sistem pelaporan yang transparan dan responsif untuk memastikan pengalaman yang aman bagi semua pengguna.',
  },
  {
    icon: Users,
    title: 'Komunitas Suportif',
    description:
      'Bergabung dengan komunitas perempuan profesional, akses artikel karir, dan dapatkan dukungan yang kamu butuhkan.',
  },
]

/**
 * Angka statistik pemasaran sesuai Figma. BUKAN data asli: backend belum
 * menyediakan endpoint statistik platform. Ganti dengan data dari API saat
 * tersedia, atau sesuaikan dengan angka yang sudah divalidasi tim.
 */
export const homeStats: HomeStat[] = [
  { icon: TrendingUp, value: '5.000+', label: 'Lowongan Aktif' },
  { icon: Users, value: '10.000+', label: 'Perempuan Terdaftar' },
  { icon: Star, value: '500+', label: 'Perusahaan Partner' },
]
