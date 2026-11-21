import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function PublicEventsPage() {
  return (
    <SkeletonPage
      title="Daftar Acara"
      description="Temukan agenda komunitas, lokakarya, dan kegiatan profesional yang mendukung perkembangan karier."
      statusTitle="Agenda komunitas"
      statusDescription="Daftar dan filter acara akan menampilkan jadwal yang bersumber dari layanan acara."
      sections={[
        {
          title: 'Jadwal dan topik',
          description:
            'Informasi tanggal, format acara, dan topik akan tersedia pada daftar maupun detail acara.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda', to: routePaths.home },
        { label: 'Acara' },
      ]}
    />
  )
}
