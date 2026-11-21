import { routePaths } from '../../../app/router/routePaths'
import { SkeletonPage } from '../../../shared/components/SkeletonPage'

export default function AdminDashboardPage() {
  return (
    <SkeletonPage
      title="Dashboard Administrator"
      description="Kerangka awal ruang administrasi untuk mengawasi konfigurasi dan kesehatan layanan GirlBoss."
      statusTitle="Ringkasan administrasi"
      statusDescription="Area ini hanya dapat dibuka oleh akun dengan role administrator tepercaya. Metrik dan tindakan administrasi memerlukan kebijakan backend."
      sections={[
        {
          title: 'Akses berbasis peran',
          description:
            'Navigasi administrasi dilindungi oleh guard frontend dan tetap harus divalidasi oleh backend.',
        },
      ]}
      breadcrumbs={[
        { label: 'Dashboard Admin', to: routePaths.admin.dashboard },
      ]}
    />
  )
}
