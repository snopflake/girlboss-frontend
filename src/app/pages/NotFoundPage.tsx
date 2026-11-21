import { routePaths } from '../router/routePaths'
import { RouteMessagePage } from './RouteMessagePage'

export default function NotFoundPage() {
  return (
    <RouteMessagePage
      code="404"
      title="Halaman tidak ditemukan"
      description="Alamat yang Anda buka tidak tersedia atau telah berubah. Gunakan beranda untuk melanjutkan penjelajahan."
      linkLabel="Kembali ke beranda"
      linkTo={routePaths.home}
    />
  )
}
