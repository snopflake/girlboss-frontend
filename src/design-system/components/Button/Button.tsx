import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'small' | 'medium'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'medium',
  leadingIcon,
  trailingIcon,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} type={type} {...props}>
      {leadingIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
      {trailingIcon && (
        <span className={styles.icon} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  )
}
