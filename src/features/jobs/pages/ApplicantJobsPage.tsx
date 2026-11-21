import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function ApplicantJobsPage() {
  return (
    <SkeletonPage
      title="Lowongan Kerja"
      description="Jelajahi lowongan yang sesuai dengan preferensi dan rencana karier Anda."
      statusTitle="Peluang untuk Anda"
      statusDescription="Daftar lowongan akan dimuat dari layanan pekerjaan. Filter dan penyimpanan lowongan belum mengirim data apa pun."
      sections={[
        {
          title: 'Temukan posisi yang sesuai',
          description:
            'Pencarian dapat membantu mempersempit pilihan berdasarkan bidang dan lokasi kerja.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda Pelamar', to: routePaths.applicant.dashboard },
        { label: 'Lowongan Kerja' },
      ]}
    />
  )
}
