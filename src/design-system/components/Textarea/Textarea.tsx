import type { TextareaHTMLAttributes } from 'react'
import styles from './Textarea.module.css'

export type TextareaResize = 'vertical' | 'none' | 'both'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
  resize?: TextareaResize
}

export function Textarea({
  invalid = false,
  resize = 'vertical',
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: TextareaProps) {
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'
  const classes = [styles.textarea, className].filter(Boolean).join(' ')
  const wrapperClasses = [
    styles.wrapper,
    isInvalid ? styles.invalid : '',
    props.disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapperClasses}>
      <textarea
        className={classes}
        data-resize={resize}
        aria-invalid={isInvalid || undefined}
        {...props}
      />
    </span>
  )
}
