import type { HTMLAttributes } from 'react'
import styles from './Card.module.css'

export type CardVariant = 'default' | 'outlined' | 'elevated'
export type CardPadding = 'default' | 'compact' | 'none'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  padding?: CardPadding
}

export function Card({
  variant = 'default',
  padding = 'default',
  className,
  ...props
}: CardProps) {
  const paddingClass = {
    default: styles.paddingDefault,
    compact: styles.paddingCompact,
    none: styles.paddingNone,
  }[padding]
  const classes = [
    styles.card,
    styles[variant],
    paddingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <article className={classes} {...props} />
}
