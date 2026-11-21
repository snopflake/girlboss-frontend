import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './Checkbox.module.css'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode
  description?: ReactNode
  invalid?: boolean
}

export function Checkbox({
  label,
  description,
  invalid = false,
  className,
  'aria-describedby': ariaDescribedby,
  'aria-invalid': ariaInvalid,
  ...props
}: CheckboxProps) {
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'
  const descriptionId = useId()
  const describedBy = [ariaDescribedby, description ? descriptionId : undefined]
    .filter(Boolean)
    .join(' ') || undefined

  const input = (
    <input
      className={[styles.checkbox, className].filter(Boolean).join(' ')}
      type="checkbox"
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      {...props}
    />
  )

  if (!label && !description) {
    return input
  }

  return (
    <label className={styles.field}>
      {input}
      <span className={styles.copy}>
        {label && <span className={styles.label}>{label}</span>}
        {description && (
          <span className={styles.description} id={descriptionId}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
