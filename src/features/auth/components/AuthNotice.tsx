import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './AuthNotice.module.css'

interface AuthNoticeProps {
  children: ReactNode
  variant?: 'error' | 'success' | 'info'
}

export function AuthNotice({ children, variant = 'error' }: AuthNoticeProps) {
  const Icon =
    variant === 'success' ? CheckCircle2 : variant === 'info' ? Info : AlertCircle

  return (
    <div
      className={[styles.notice, styles[variant]].join(' ')}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon aria-hidden="true" size={18} />
      <div>{children}</div>
    </div>
  )
}
