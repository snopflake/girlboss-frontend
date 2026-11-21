import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function ManageJobsPage() {
  return (
    <SkeletonPage
      title="Kelola Lowongan"
      description="Tinjau dan atur lowongan yang diterbitkan oleh perusahaan Anda."
      statusTitle="Daftar lowongan perusahaan"
      statusDescription="Lowongan hanya akan ditampilkan setelah layanan memverifikasi akses perusahaan. Kerangka ini belum membuat atau mengubah data."
      sections={[
        {
          title: 'Status publikasi',
          description:
            'Informasi status dan periode publikasi akan tersedia untuk setiap lowongan perusahaan.',
        },
      ]}
      breadcrumbs={[
        { label: 'Dashboard', to: routePaths.company.dashboard },
        { label: 'Kelola Lowongan' },
      ]}
    />
  )
}
