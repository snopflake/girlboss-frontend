import { CircleAlert } from 'lucide-react'
import { Button, Card } from '../../../design-system/components'
import styles from './ProfileLoadState.module.css'

/** Skeleton pemuatan halaman profil. */
export function ProfileSkeleton({ label }: { label: string }) {
  return (
    <div className={styles.skeleton} role="status" aria-busy="true">
      <span className={styles.visuallyHidden}>{label}</span>
      <span className={[styles.block, styles.headerBlock].join(' ')} aria-hidden="true" />
      <span className={[styles.block, styles.tabsBlock].join(' ')} aria-hidden="true" />
      <span className={[styles.block, styles.formBlock].join(' ')} aria-hidden="true" />
    </div>
  )
}

/** Error state halaman profil dengan tombol coba lagi. */
export function ProfileLoadError({
  title,
  isRetrying,
  onRetry,
}: {
  title: string
  isRetrying: boolean
  onRetry(): void
}) {
  return (
    <Card variant="outlined" className={styles.errorCard} role="alert">
      <span className={styles.errorIcon} aria-hidden="true">
        <CircleAlert size={32} />
      </span>
      <h1 className={styles.errorTitle}>{title}</h1>
      <p className={styles.errorText}>
        Data profil tidak dapat dimuat. Periksa koneksi lalu coba lagi.
      </p>
      <Button variant="outline" onClick={onRetry} disabled={isRetrying}>
        {isRetrying ? 'Memuat ulang…' : 'Coba Lagi'}
      </Button>
    </Card>
  )
}
