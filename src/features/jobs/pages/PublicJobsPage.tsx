import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function PublicJobsPage() {
  return (
    <SkeletonPage
      title="Daftar Lowongan"
      description="Temukan kesempatan kerja yang relevan dengan minat, keahlian, dan arah karier Anda."
      statusTitle="Pencarian lowongan"
      statusDescription="Daftar, filter, dan pencarian lowongan akan menampilkan data terverifikasi ketika layanan lowongan tersedia."
      sections={[
        {
          title: 'Pencarian dan filter',
          description:
            'Kerangka ini disiapkan untuk pencarian berdasarkan posisi, lokasi, dan kriteria kerja.',
        },
        {
          title: 'Informasi lowongan',
          description:
            'Buka detail lowongan untuk meninjau deskripsi, kualifikasi, dan informasi perusahaan.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda', to: routePaths.home },
        { label: 'Lowongan' },
      ]}
    />
  )
}
