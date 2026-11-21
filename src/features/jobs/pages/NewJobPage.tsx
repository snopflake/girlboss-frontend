import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function NewJobPage() {
  return (
    <SkeletonPage
      title="Tambah Lowongan"
      description="Siapkan informasi posisi, tanggung jawab, dan kualifikasi agar kandidat memahami kesempatan yang ditawarkan."
      statusTitle="Struktur publikasi lowongan"
      statusDescription="Form dan proses publikasi belum diaktifkan. Tidak ada lowongan yang dibuat pada tahap kerangka ini."
      sections={[
        {
          title: 'Informasi yang akan disiapkan',
          description:
            'Rincian posisi, lokasi kerja, tipe pekerjaan, dan kualifikasi akan diatur setelah validasi serta API tersedia.',
        },
      ]}
      breadcrumbs={[
        { label: 'Dashboard', to: routePaths.company.dashboard },
        { label: 'Kelola Lowongan', to: routePaths.company.jobs },
        { label: 'Tambah Lowongan' },
      ]}
    />
  )
}
