import { Link } from 'react-router'
import { Badge } from '../../../design-system/components'
import { useAuth } from '../../../app/providers/useAuth'
import { routePaths } from '../../../app/router/routePaths'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const { isConfigured } = useAuth()

  return (
    <section className={styles.page} aria-labelledby="register-title">
      <h1 id="register-title">Bergabung dengan GirlBoss</h1>
      <p>
        Registrasi akan menyiapkan akun untuk mengakses peluang kerja dan
        dukungan pengembangan karier.
      </p>
      <Badge variant={isConfigured ? 'info' : 'warning'}>
        {isConfigured
          ? 'Penyedia autentikasi tersedia'
          : 'Supabase belum dikonfigurasi'}
      </Badge>
      <p>
        Form registrasi belum diaktifkan. Penetapan peran dilakukan melalui
        metadata akun tepercaya, bukan pilihan pada halaman ini.
      </p>
      <div className={styles.actions}>
        <span>Sudah memiliki akun?</span>
        <Link className={styles.link} to={routePaths.login}>
          Masuk
        </Link>
      </div>
    </section>
  )
}
