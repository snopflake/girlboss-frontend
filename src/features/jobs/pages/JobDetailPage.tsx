import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function JobDetailPage() {
  return (
    <SkeletonPage
      title="Detail Lowongan"
      description="Tinjau tanggung jawab, kualifikasi, dan informasi perusahaan sebelum menentukan langkah berikutnya."
      statusTitle="Informasi lowongan"
      statusDescription="Detail ditampilkan berdasarkan lowongan yang dipilih setelah integrasi sumber data tersedia. Belum ada lamaran atau transaksi yang dibuat."
      sections={[
        {
          title: 'Deskripsi dan kualifikasi',
          description:
            'Konten pekerjaan dan persyaratan akan ditampilkan secara terstruktur pada halaman ini.',
        },
        {
          title: 'Profil perusahaan',
          description:
            'Informasi perusahaan penerbit lowongan akan ditautkan ke profil yang telah diverifikasi.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda', to: routePaths.home },
        { label: 'Lowongan', to: routePaths.jobs },
        { label: 'Detail Lowongan' },
      ]}
    />
  )
}
