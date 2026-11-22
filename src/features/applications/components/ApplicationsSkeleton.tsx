import styles from './ApplicationsSkeleton.module.css'

/** Placeholder pemuatan untuk daftar & detail lamaran. */
export function ApplicationsSkeleton({
  variant = 'list',
  label,
}: {
  variant?: 'list' | 'detail'
  label: string
}) {
  return (
    <div className={styles.wrapper} role="status" aria-busy="true">
      <span className={styles.visuallyHidden}>{label}</span>
      {variant === 'list' ? (
        <>
          <div className={styles.stats} aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index} className={[styles.block, styles.stat].join(' ')} />
            ))}
          </div>
          <span className={[styles.block, styles.toolbar].join(' ')} aria-hidden="true" />
          {Array.from({ length: 3 }, (_, index) => (
            <span
              key={index}
              className={[styles.block, styles.card].join(' ')}
              aria-hidden="true"
            />
          ))}
        </>
      ) : (
        <div className={styles.detail} aria-hidden="true">
          <div className={styles.column}>
            <span className={[styles.block, styles.card].join(' ')} />
            <span className={[styles.block, styles.tall].join(' ')} />
          </div>
          <div className={styles.column}>
            <span className={[styles.block, styles.card].join(' ')} />
          </div>
        </div>
      )}
    </div>
  )
}
