import { routePaths } from '../router/routePaths'
import { RouteMessagePage } from './RouteMessagePage'

export default function ForbiddenPage() {
  return (
    <RouteMessagePage
      code="403"
      title="Akses tidak tersedia"
      description="Akun ini tidak memiliki peran tepercaya yang diperlukan untuk membuka halaman tersebut. Jika akses seharusnya tersedia, hubungi administrator."
      linkLabel="Kembali ke beranda"
      linkTo={routePaths.home}
    />
  )
}
