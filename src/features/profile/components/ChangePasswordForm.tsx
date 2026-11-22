import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormField, Input } from '../../../design-system/components'
import { passwordChangeSchema, type PasswordChangeValues } from '../schemas/applicantProfileSchemas'
import formStyles from './profileForm.module.css'
import styles from './ChangePasswordForm.module.css'

/**
 * Form ganti password (pelamar & perusahaan). Belum ada endpoint ganti
 * password: validasi hanya di sisi klien, tanpa menyimpan atau mengirim
 * password ke mana pun.
 */
export function ChangePasswordForm() {
  const idPrefix = useId()
  const [notice, setNotice] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const submit = handleSubmit(() => {
    reset()
    setNotice(
      'Format password sudah valid, tetapi layanan ganti password belum terhubung ke server. Password Anda belum diubah.',
    )
  })

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <h3 className={formStyles.subTitle}>Ganti Password</h3>
      <FormField
        id={`${idPrefix}-current`}
        label="Password Saat Ini"
        required
        error={errors.currentPassword?.message}
      >
        {(controlProps) => (
          <Input {...controlProps} {...register('currentPassword')} type="password" autoComplete="current-password" />
        )}
      </FormField>
      <FormField
        id={`${idPrefix}-new`}
        label="Password Baru"
        required
        hint="Minimal 8 karakter, berisi huruf dan angka"
        error={errors.newPassword?.message}
      >
        {(controlProps) => (
          <Input {...controlProps} {...register('newPassword')} type="password" autoComplete="new-password" />
        )}
      </FormField>
      <FormField
        id={`${idPrefix}-confirm`}
        label="Konfirmasi Password Baru"
        required
        error={errors.confirmPassword?.message}
      >
        {(controlProps) => (
          <Input {...controlProps} {...register('confirmPassword')} type="password" autoComplete="new-password" />
        )}
      </FormField>
      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}
      <div>
        <Button type="submit" onClick={() => setNotice(null)}>
          Perbarui Password
        </Button>
      </div>
    </form>
  )
}
