import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function ApplicantProfilePage() {
  return (
    <SkeletonPage
      title="Profil Pelamar"
      description="Kelola informasi profesional yang membantu perusahaan memahami keahlian dan tujuan karier Anda."
      statusTitle="Informasi profil"
      statusDescription="Profil akan memuat data akun yang terotorisasi. Belum ada data pribadi contoh atau perubahan yang disimpan."
      sections={[
        {
          title: 'Ringkasan profesional',
          description:
            'Pengalaman, keahlian, dan preferensi karier akan dikelola setelah aturan akses profil tersedia.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda Pelamar', to: routePaths.applicant.dashboard },
        { label: 'Profil' },
      ]}
    />
  )
}
