import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function ApplicantEventsPage() {
  return (
    <SkeletonPage
      title="Kalender Acara"
      description="Rencanakan partisipasi pada acara yang relevan dengan minat dan perjalanan karier Anda."
      statusTitle="Agenda untuk pelamar"
      statusDescription="Kalender dan detail acara akan tersinkron dengan data acara setelah integrasi layanan tersedia."
      sections={[
        {
          title: 'Temukan kegiatan',
          description:
            'Jelajahi jadwal komunitas dan kegiatan pengembangan profesional dalam satu tampilan.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda Pelamar', to: routePaths.applicant.dashboard },
        { label: 'Kalender Acara' },
      ]}
    />
  )
}
