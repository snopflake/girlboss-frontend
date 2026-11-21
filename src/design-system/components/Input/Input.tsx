import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
  startAdornment?: ReactNode
  endAdornment?: ReactNode
}

export function Input({
  invalid = false,
  startAdornment,
  endAdornment,
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'
  const inputClasses = [styles.input, className].filter(Boolean).join(' ')
  const wrapperClasses = [
    styles.wrapper,
    isInvalid ? styles.invalid : '',
    props.disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapperClasses}>
      {startAdornment && (
        <span className={styles.adornment} aria-hidden="true">
          {startAdornment}
        </span>
      )}
      <input
        className={inputClasses}
        aria-invalid={isInvalid || undefined}
        {...props}
      />
      {endAdornment && (
        <span className={styles.adornment} aria-hidden="true">
          {endAdornment}
        </span>
      )}
    </span>
  )
}
