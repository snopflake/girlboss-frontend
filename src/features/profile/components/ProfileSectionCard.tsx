import { useId, type ReactNode } from 'react'
import { Card } from '../../../design-system/components'
import styles from './ProfileSectionCard.module.css'

interface ProfileSectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

/** Kartu seksi profil: header (judul, deskripsi, aksi), isi, dan footer opsional. */
export function ProfileSectionCard({
  title,
  description,
  action,
  footer,
  children,
}: ProfileSectionCardProps) {
  const titleId = useId()

  return (
    <Card variant="outlined" padding="none" className={styles.card} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {action}
      </header>
      <div className={styles.body}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </Card>
  )
}
