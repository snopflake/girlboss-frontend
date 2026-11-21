import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function CompanyDashboardPage() {
  return (
    <SkeletonPage
      title="Dashboard Perusahaan"
      description="Pusat kerja perusahaan untuk meninjau kebutuhan rekrutmen dan mengelola aktivitas lowongan."
      statusTitle="Ringkasan rekrutmen"
      statusDescription="Informasi lowongan dan lamaran masuk akan tampil setelah backend menyediakan data perusahaan yang terotorisasi."
      sections={[
        {
          title: 'Kelola lowongan',
          description:
            'Siapkan dan tinjau daftar lowongan perusahaan melalui ruang pengelolaan lowongan.',
        },
        {
          title: 'Tinjau lamaran',
          description:
            'Lamaran masuk akan dapat ditinjau dari ruang khusus perusahaan setelah integrasi tersedia.',
        },
      ]}
      breadcrumbs={[{ label: 'Dashboard', to: routePaths.company.dashboard }]}
    />
  )
}
