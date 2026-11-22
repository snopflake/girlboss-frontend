import { Heart } from 'lucide-react'
import { useId } from 'react'
import { Link } from 'react-router'
import { Card } from '../../../design-system/components'
import { homeFeatures, homeStats } from '../content/homeContent'
import styles from './HomeLanding.module.css'

interface HomeAction {
  label: string
  to: string
}

interface HomeLandingProps {
  /** Tombol utama hero (wajib). */
  primaryAction: HomeAction
  /** Tombol kedua hero (mis. "Daftar Sekarang" untuk pengunjung). */
  secondaryAction?: HomeAction
  /** Tampilkan pita statistik platform. */
  showStats?: boolean
  /** Tombol pada CTA penutup. */
  closingAction?: HomeAction
}

/**
 * Beranda GirlBoss. Dipakai oleh beranda publik dan beranda pelamar dengan
 * aksi yang berbeda sesuai frame Figma masing-masing.
 */
export function HomeLanding({
  primaryAction,
  secondaryAction,
  showStats = false,
  closingAction,
}: HomeLandingProps) {
  const heroTitleId = useId()
  const featuresTitleId = useId()
  const statsTitleId = useId()
  const closingTitleId = useId()

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby={heroTitleId}>
        <p className={styles.eyebrow}>Berdayakan Karirmu</p>
        <h1 id={heroTitleId} className={styles.heroTitle}>
          Selamat Datang di GirlBoss
        </h1>
        <p className={styles.heroText}>
          Platform pencarian kerja yang didedikasikan khusus untuk memberdayakan perempuan
          Indonesia. Temukan peluang karir yang tepat, bergabung dengan komunitas yang
          mendukung, dan wujudkan impianmu.
        </p>
        <div className={styles.actions}>
          <Link to={primaryAction.to} className={styles.ctaPrimary}>
            {primaryAction.label}
          </Link>
          {secondaryAction && (
            <Link to={secondaryAction.to} className={styles.ctaOutline}>
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </section>

      <section aria-labelledby={featuresTitleId}>
        <h2 id={featuresTitleId} className={styles.visuallyHidden}>
          Keunggulan GirlBoss
        </h2>
        <ul className={styles.features}>
          {homeFeatures.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <Card variant="outlined" className={styles.feature}>
                <span className={styles.featureIcon} aria-hidden="true">
                  <Icon size={24} />
                </span>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureText}>{description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {showStats && (
        <section className={styles.stats} aria-labelledby={statsTitleId}>
          <h2 id={statsTitleId} className={styles.visuallyHidden}>
            GirlBoss dalam angka
          </h2>
          <ul className={styles.statList}>
            {homeStats.map(({ icon: Icon, value, label }) => (
              <li key={label} className={styles.stat}>
                <Icon aria-hidden="true" size={32} strokeWidth={1.75} />
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.closing} aria-labelledby={closingTitleId}>
        <Heart aria-hidden="true" size={48} strokeWidth={1.75} className={styles.closingIcon} />
        <h2 id={closingTitleId} className={styles.closingTitle}>
          Mulai Perjalanan Karirmu Hari Ini
        </h2>
        <p className={styles.closingText}>
          Bergabunglah dengan ribuan perempuan Indonesia yang telah menemukan karir impian
          mereka melalui GirlBoss.
        </p>
        {closingAction && (
          <Link to={closingAction.to} className={styles.ctaPrimary}>
            {closingAction.label}
          </Link>
        )}
      </section>
    </div>
  )
}
