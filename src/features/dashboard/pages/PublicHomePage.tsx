import { routePaths } from '../../../app/router/routePaths'
import { HomeLanding } from '../components/HomeLanding'

export default function PublicHomePage() {
  return (
    <HomeLanding
      primaryAction={{ label: 'Cari Lowongan Kerja', to: routePaths.jobs }}
      secondaryAction={{ label: 'Daftar Sekarang', to: routePaths.register }}
      showStats
      closingAction={{ label: 'Daftar Gratis Sekarang', to: routePaths.register }}
    />
  )
}
