import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function CompanyProfilePage() {
  return (
    <SkeletonPage
      title="Profil Perusahaan"
      description="Tinjau informasi perusahaan yang ditampilkan kepada kandidat pada lowongan dan halaman profil."
      statusTitle="Informasi organisasi"
      statusDescription="Profil perusahaan akan dimuat dan diperbarui hanya oleh pengguna yang terotorisasi oleh layanan."
      sections={[
        {
          title: 'Identitas dan budaya',
          description:
            'Ringkasan organisasi, bidang kerja, dan informasi profesional akan disiapkan di area ini.',
        },
      ]}
      breadcrumbs={[
        { label: 'Dashboard', to: routePaths.company.dashboard },
        { label: 'Profil Perusahaan' },
      ]}
    />
  )
}
