import { useId, type ReactNode } from 'react'
import styles from './FormField.module.css'

export interface FormFieldControlProps {
  id: string
  required: boolean
  invalid: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export interface FormFieldProps {
  id: string
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  children: (controlProps: FormFieldControlProps) => ReactNode
}

export function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: FormFieldProps) {
  const messageId = useId()
  const hasError = Boolean(error)
  const hasHint = Boolean(hint)
  const describedBy = [
    hasError ? `${messageId}-error` : undefined,
    hasHint ? `${messageId}-hint` : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children({
        id,
        required,
        invalid: hasError,
        'aria-describedby': describedBy,
        'aria-invalid': hasError || undefined,
      })}
      {hasError && (
        <span className={styles.error} id={`${messageId}-error`} role="alert">
          {error}
        </span>
      )}
      {hasHint && (
        <span className={styles.hint} id={`${messageId}-hint`}>
          {hint}
        </span>
      )}
    </div>
  )
}
