import styles from './EventsSkeleton.module.css'

export function EventsSkeleton({
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
        <div className={styles.grid} aria-hidden="true">
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} className={[styles.block, styles.card].join(' ')} />
          ))}
        </div>
      ) : (
        <div className={styles.detail} aria-hidden="true">
          <div className={styles.column}>
            <span className={[styles.block, styles.hero].join(' ')} />
            <span className={[styles.block, styles.content].join(' ')} />
          </div>
          <span className={[styles.block, styles.aside].join(' ')} />
        </div>
      )}
    </div>
  )
}
