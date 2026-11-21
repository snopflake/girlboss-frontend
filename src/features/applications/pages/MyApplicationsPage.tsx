import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function MyApplicationsPage() {
  return (
    <SkeletonPage
      title="Lamaran Saya"
      description="Pantau kesempatan yang telah Anda lamar dan perkembangan proses seleksinya."
      statusTitle="Riwayat lamaran"
      statusDescription="Riwayat dan status lamaran akan dimuat secara privat untuk akun Anda setelah autentikasi dan sumber data tersedia."
      sections={[
        {
          title: 'Perjalanan setiap lamaran',
          description:
            'Informasi perusahaan, posisi, tanggal pengajuan, dan pembaruan status akan tersusun di halaman ini.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda Pelamar', to: routePaths.applicant.dashboard },
        { label: 'Lamaran Saya' },
      ]}
    />
  )
}
