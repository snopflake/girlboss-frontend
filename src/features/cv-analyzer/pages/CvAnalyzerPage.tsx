import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function CvAnalyzerPage() {
  return (
    <SkeletonPage
      title="AI CV Analyzer"
      description="Area persiapan untuk meninjau struktur CV dan mendapatkan masukan pengembangan yang relevan."
      statusTitle="Ruang analisis CV"
      statusDescription="Unggah dokumen dan analisis AI belum diaktifkan. Belum ada berkas yang diunggah atau dikirim ke layanan eksternal."
      sections={[
        {
          title: 'Privasi dokumen',
          description:
            'Alur unggah dan retensi dokumen perlu ditetapkan sebelum pemrosesan CV dapat digunakan.',
        },
        {
          title: 'Umpan balik terarah',
          description:
            'Hasil analisis akan menjelaskan area yang dapat diperbaiki tanpa mengubah CV secara otomatis.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda Pelamar', to: routePaths.applicant.dashboard },
        { label: 'AI CV Analyzer' },
      ]}
    />
  )
}
