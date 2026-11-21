import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function SavedJobsPage() {
  return (
    <SkeletonPage
      title="Lowongan Tersimpan"
      description="Kumpulan lowongan yang Anda tandai untuk ditinjau dan dibandingkan kembali."
      statusTitle="Daftar simpanan Anda"
      statusDescription="Belum ada lowongan tersimpan yang ditampilkan. Daftar ini akan menggunakan simpanan milik akun Anda setelah autentikasi dan layanan data terhubung."
      sections={[
        {
          title: 'Atur peluang pilihan',
          description:
            'Simpan lowongan dari daftar pekerjaan agar mudah kembali ke informasinya.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda Pelamar', to: routePaths.applicant.dashboard },
        { label: 'Lowongan Tersimpan' },
      ]}
    />
  )
}
