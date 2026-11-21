import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export function Select({
  invalid = false,
  className,
  'aria-invalid': ariaInvalid,
  children,
  ...props
}: SelectProps) {
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'
  const classes = [styles.select, className].filter(Boolean).join(' ')
  const wrapperClasses = [
    styles.wrapper,
    isInvalid ? styles.invalid : '',
    props.disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapperClasses}>
      <select
        className={classes}
        aria-invalid={isInvalid || undefined}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
    </span>
  )
}
