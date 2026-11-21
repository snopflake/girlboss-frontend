import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function InterviewPage() {
  return (
    <SkeletonPage
      title="Persiapan Wawancara"
      description="Ruang untuk berlatih menjawab pertanyaan wawancara dan meninjau evaluasi persiapan."
      statusTitle="Sesi latihan belum tersedia"
      statusDescription="Pertanyaan, perekaman jawaban, dan evaluasi AI belum dijalankan. Tidak ada sesi atau hasil evaluasi contoh yang dibuat."
      sections={[
        {
          title: 'Latihan terarah',
          description:
            'Sesi mendatang dapat membantu Anda berlatih menjelaskan pengalaman dan kompetensi.',
        },
        {
          title: 'Evaluasi yang transparan',
          description:
            'Masukan evaluasi akan dijelaskan beserta batasannya sebelum fitur AI digunakan.',
        },
      ]}
      breadcrumbs={[
        { label: 'Beranda Pelamar', to: routePaths.applicant.dashboard },
        { label: 'Persiapan Wawancara' },
      ]}
    />
  )
}
