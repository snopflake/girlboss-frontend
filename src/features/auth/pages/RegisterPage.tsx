import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import {
  Button,
  Card,
  Checkbox,
  FormField,
  Input,
} from '../../../design-system/components'
import {
  AuthApiError,
  registerWithApi,
} from '../api/authApi'
import { AuthNotice } from '../components/AuthNotice'
import { PasswordField } from '../components/PasswordField'
import { RoleSelector } from '../components/RoleSelector'
import {
  registerSchema,
  type RegisterFormValues,
} from '../schemas/authSchemas'
import styles from './AuthPage.module.css'

const roleOptions = [
  {
    value: 'APPLICANT',
    label: 'Pencari Kerja',
    description: 'Saya mencari peluang karir',
  },
  {
    value: 'COMPANY',
    label: 'Perusahaan',
    description: 'Saya ingin merekrut talenta',
  },
] as const

export default function RegisterPage() {
  const [requestError, setRequestError] = useState<string | null>(null)
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null,
  )
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: 'APPLICANT',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      acceptedTerms: false,
    },
    mode: 'onTouched',
  })
  const [accountType, setAccountType] = useState<'APPLICANT' | 'COMPANY'>(
    'APPLICANT',
  )

  const submit = handleSubmit(async (values) => {
    setRequestError(null)
    setConfirmationMessage(null)
    const sharedPayload = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password,
    }
    try {
      const message =
        values.accountType === 'COMPANY'
          ? await registerWithApi({
              ...sharedPayload,
              accountType: 'COMPANY',
              companyName: values.companyName?.trim() ?? '',
            })
          : await registerWithApi({
              ...sharedPayload,
              accountType: 'APPLICANT',
            })
      setConfirmationMessage(message)
    } catch (error) {
      setRequestError(
        error instanceof AuthApiError
          ? error.message
          : 'Pendaftaran belum dapat diproses. Silakan coba kembali.',
      )
    }
  })

  return (
    <Card
      aria-labelledby="register-title"
      className={`${styles.card} ${styles.registerCard}`}
      padding="none"
    >
      <header className={styles.heading}>
        <h1 id="register-title">Daftar di GirlBoss</h1>
        <p>Mulai perjalanan karirmu bersama kami</p>
      </header>

      {confirmationMessage ? (
        <div className={styles.confirmation}>
          <AuthNotice variant="success">
            <strong>Permintaan pendaftaran diterima.</strong>
            <p>{confirmationMessage}</p>
          </AuthNotice>
          <p className={styles.confirmationHint}>
            Jika email verifikasi tidak masuk, periksa folder spam atau coba
            kembali nanti.
          </p>
        </div>
      ) : (
        <form className={styles.form} noValidate onSubmit={submit}>
          <RoleSelector<'APPLICANT' | 'COMPANY'>
            label="Daftar sebagai"
            onChange={(value) => {
              setAccountType(value)
              setValue('accountType', value, {
                shouldDirty: true,
                shouldValidate: true,
              })
              if (value === 'APPLICANT') {
                setValue('companyName', '')
              }
            }}
            options={roleOptions}
            value={accountType}
            variant="cards"
          />

          <FormField
            id="fullName"
            label="Nama Lengkap"
            error={errors.fullName?.message}
            required
          >
            {(controlProps) => (
              <Input
                {...controlProps}
                {...register('fullName')}
                autoComplete="name"
                placeholder="Nama lengkap"
              />
            )}
          </FormField>

          <FormField
            id="register-email"
            label="Email"
            error={errors.email?.message}
            required
          >
            {(controlProps) => (
              <Input
                {...controlProps}
                {...register('email')}
                autoComplete="email"
                placeholder="nama@email.com"
                type="email"
              />
            )}
          </FormField>

          {accountType === 'COMPANY' && (
            <FormField
              id="companyName"
              label="Nama Perusahaan"
              error={errors.companyName?.message}
              required
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  {...register('companyName')}
                  autoComplete="organization"
                  placeholder="Nama perusahaan"
                />
              )}
            </FormField>
          )}

          <PasswordField
            error={errors.password?.message}
            id="register-password"
            label="Password"
            placeholder="Minimal 8 karakter"
            registration={register('password')}
          />

          <PasswordField
            error={errors.confirmPassword?.message}
            id="confirmPassword"
            label="Konfirmasi Password"
            placeholder="Ketik ulang password"
            registration={register('confirmPassword')}
          />

          <div className={styles.consentField}>
            <Checkbox
              {...register('acceptedTerms')}
              invalid={Boolean(errors.acceptedTerms)}
              label={
                <>
                  Saya menyetujui syarat dan ketentuan serta kebijakan privasi.
                  Dokumen belum tersedia untuk ditautkan.
                </>
              }
            />
            {errors.acceptedTerms?.message && (
              <span className={styles.fieldError} role="alert">
                {errors.acceptedTerms.message}
              </span>
            )}
          </div>

          {requestError && <AuthNotice>{requestError}</AuthNotice>}

          <Button
            className={styles.submitButton}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Memproses pendaftaran...' : 'Daftar Sekarang'}
          </Button>
        </form>
      )}

      <p className={styles.footerText}>
        Sudah punya akun?{' '}
        <Link className={styles.link} to={routePaths.login}>
          Masuk di sini
        </Link>
      </p>
    </Card>
  )
}
