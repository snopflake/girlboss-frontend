import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FormField, Input } from '../../../design-system/components'
import styles from './PasswordField.module.css'

interface PasswordFieldProps {
  id: string
  label: string
  placeholder: string
  error?: string
  registration: UseFormRegisterReturn
}

export function PasswordField({
  id,
  label,
  placeholder,
  error,
  registration,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <FormField id={id} label={label} error={error} required>
      {(controlProps) => (
        <span className={styles.inputRow}>
          <Input
            {...controlProps}
            {...registration}
            autoComplete={id === 'password' ? 'current-password' : 'new-password'}
            placeholder={placeholder}
            type={visible ? 'text' : 'password'}
          />
          <button
            aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
            aria-pressed={visible}
            className={styles.toggle}
            onClick={() => setVisible((current) => !current)}
            type="button"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      )}
    </FormField>
  )
}
