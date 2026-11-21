import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function EventDetailPage() {
  return (
    <SkeletonPage
      title="Detail Acara"
      description="Pelajari agenda, sasaran peserta, dan informasi penyelenggaraan acara."
      statusTitle="Informasi acara"
      statusDescription="Detail akan dimuat berdasarkan acara yang dipilih. Pendaftaran acara belum tersedia dan tidak ada reservasi yang dibuat."
      sections={[
        {
          title: 'Agenda dan penyelenggara',
          description:
            'Agenda, pembicara, waktu, dan penyelenggara akan ditampilkan setelah data acara tersedia.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda', to: routePaths.home },
        { label: 'Acara', to: routePaths.eventList },
        { label: 'Detail Acara' },
      ]}
    />
  )
}
