import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function EditJobPage() {
  return (
    <SkeletonPage
      title="Edit Lowongan"
      description="Tinjau dan perbarui informasi lowongan yang dikelola perusahaan."
      statusTitle="Penyuntingan belum tersedia"
      statusDescription="Lowongan akan dimuat berdasarkan identitas rute dan diverifikasi kepemilikannya sebelum perubahan dapat dilakukan."
      sections={[
        {
          title: 'Perubahan yang terkontrol',
          description:
            'Penyimpanan dan validasi perubahan memerlukan layanan backend serta aturan akses perusahaan.',
        },
      ]}
      breadcrumbs={[
        { label: 'Dashboard', to: routePaths.company.dashboard },
        { label: 'Kelola Lowongan', to: routePaths.company.jobs },
        { label: 'Edit Lowongan' },
      ]}
    />
  )
}
