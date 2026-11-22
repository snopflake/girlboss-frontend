import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './ApplicationNotice.module.css'

export type ApplicationNoticeVariant = 'info' | 'success' | 'neutral' | 'danger'

const icons = {
  info: Info,
  success: CircleCheck,
  neutral: Info,
  danger: CircleAlert,
}

export function ApplicationNotice({
  variant = 'info',
  children,
}: {
  variant?: ApplicationNoticeVariant
  children: ReactNode
}) {
  const Icon = icons[variant]

  return (
    <div
      className={[styles.notice, styles[variant]].join(' ')}
      role={variant === 'danger' ? 'alert' : 'status'}
    >
      <Icon aria-hidden="true" size={16} />
      <p>{children}</p>
    </div>
  )
}
