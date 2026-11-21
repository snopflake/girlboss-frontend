import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function ApplicantDashboardPage() {
  return (
    <SkeletonPage
      title="Beranda Pelamar"
      description="Ruang personal untuk menemukan peluang, mengikuti lamaran, dan merencanakan langkah karier berikutnya."
      statusTitle="Ringkasan aktivitas pelamar"
      statusDescription="Lowongan tersimpan, proses lamaran, dan agenda acara akan dirangkum di sini setelah integrasi data yang terotorisasi tersedia."
      sections={[
        {
          title: 'Temukan peluang',
          description:
            'Jelajahi lowongan kerja dan simpan kesempatan yang ingin Anda tinjau kembali.',
        },
        {
          title: 'Persiapan karier',
          description:
            'Akses area analisis CV dan persiapan wawancara dari navigasi pelamar.',
        },
      ]}
      breadcrumbs={[{ label: 'Beranda Pelamar', to: routePaths.applicant.dashboard }]}
    />
  )
}
