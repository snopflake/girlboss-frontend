import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function IncomingApplicationsPage() {
  return (
    <SkeletonPage
      title="Lamaran Masuk"
      description="Tinjau kandidat yang melamar posisi di perusahaan Anda secara terstruktur."
      statusTitle="Pusat peninjauan kandidat"
      statusDescription="Data kandidat dan dokumen hanya akan tersedia setelah backend memvalidasi akses perusahaan. Tidak ada profil kandidat contoh yang ditampilkan."
      sections={[
        {
          title: 'Tinjau proses seleksi',
          description:
            'Penyaringan dan perubahan status lamaran akan menggunakan kebijakan akses dari backend.',
        },
      ]}
      breadcrumbs={[
        { label: 'Dashboard', to: routePaths.company.dashboard },
        { label: 'Lamaran Masuk' },
      ]}
    />
  )
}
