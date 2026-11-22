import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
  startAdornment?: ReactNode
  endAdornment?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    invalid = false,
    startAdornment,
    endAdornment,
    className,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
) {
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
        ref={ref}
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
})
