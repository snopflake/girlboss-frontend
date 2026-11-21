import { Link } from 'react-router'
import { Badge } from '../../../design-system/components'
import { useAuth } from '../../../app/providers/useAuth'
import { routePaths } from '../../../app/router/routePaths'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const { isConfigured } = useAuth()

  return (
    <section className={styles.page} aria-labelledby="login-title">
      <h1 id="login-title">Masuk ke GirlBoss</h1>
      <p>
        Masuk akan memberi akses ke ruang kerja sesuai peran yang telah
        ditetapkan untuk akun Anda.
      </p>
      <Badge variant={isConfigured ? 'info' : 'warning'}>
        {isConfigured
          ? 'Penyedia autentikasi tersedia'
          : 'Supabase belum dikonfigurasi'}
      </Badge>
      <p>
        Form masuk belum diaktifkan. Tidak ada sesi yang dibuat secara otomatis
        pada kerangka ini.
      </p>
      <div className={styles.actions}>
        <span>Belum memiliki akun?</span>
        <Link className={styles.link} to={routePaths.register}>
          Daftar
        </Link>
      </div>
    </section>
  )
}
