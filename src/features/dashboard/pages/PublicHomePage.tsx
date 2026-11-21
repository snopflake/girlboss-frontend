import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function PublicHomePage() {
  return (
    <SkeletonPage
      title="Temukan ruang untuk bertumbuh"
      description="GirlBoss menghubungkan perempuan dengan peluang kerja, komunitas profesional, dan sarana persiapan karier."
      statusTitle="Jelajahi peluang karier"
      statusDescription="Lowongan kerja dan acara komunitas dapat dijelajahi dari navigasi utama. Konten akan terhubung ke sumber data setelah layanan aplikasi tersedia."
      sections={[
        {
          title: 'Peluang kerja',
          description:
            'Cari peran yang sesuai dengan keahlian, pengalaman, dan tujuan karier Anda.',
        },
        {
          title: 'Dukungan karier',
          description:
            'Kenali fitur persiapan CV, wawancara, dan acara profesional yang akan mendukung perjalanan karier.',
        },
      ]}
      breadcrumbs={[{ label: 'Beranda', to: routePaths.home }]}
    />
  )
}
