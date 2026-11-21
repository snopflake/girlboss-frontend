import type { HTMLAttributes } from 'react'
import styles from './Badge.module.css'

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({
  variant = 'neutral',
  className,
  ...props
}: BadgeProps) {
  const classes = [styles.badge, styles[variant], className]
    .filter(Boolean)
    .join(' ')

  return <span className={classes} {...props} />
}
