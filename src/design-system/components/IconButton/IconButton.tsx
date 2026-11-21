import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.css'

export type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'danger'
export type IconButtonSize = 'small' | 'medium' | 'large'

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  icon: ReactNode
  'aria-label': string
  variant?: IconButtonVariant
  size?: IconButtonSize
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'medium',
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  const classes = [styles.iconButton, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} type={type} {...props}>
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
