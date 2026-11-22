import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../../app/providers/useAuth'
import { routePaths } from '../../../app/router/routePaths'
import {
  Button,
  Card,
  FormField,
  Input,
} from '../../../design-system/components'
import { AuthApiError } from '../api/authApi'
import { AuthNotice } from '../components/AuthNotice'
import { PasswordField } from '../components/PasswordField'
import { RoleSelector } from '../components/RoleSelector'
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas'
import styles from './AuthPage.module.css'

type PublicRole = 'APPLICANT' | 'COMPANY'

const roleOptions = [
  { value: 'APPLICANT', label: 'Jobseeker' },
  { value: 'COMPANY', label: 'Employer' },
] as const

function destinationForRole(role: 'applicant' | 'company' | 'admin') {
  if (role === 'applicant') return routePaths.applicant.dashboard
  if (role === 'company') return routePaths.company.dashboard
  return routePaths.admin.dashboard
}

function roleLabel(role: 'applicant' | 'company' | 'admin') {
  if (role === 'applicant') return 'Jobseeker'
  if (role === 'company') return 'Employer'
  return 'Admin'
}

export default function LoginPage() {
  const { signIn, error: sessionError } = useAuth()
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<PublicRole>('APPLICANT')
  const [requestError, setRequestError] = useState<string | null>(null)
  const [roleMismatch, setRoleMismatch] = useState<{
    label: string
    destination: string
  } | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  const submit = handleSubmit(async ({ email, password }) => {
    setRequestError(null)
    setRoleMismatch(null)
    try {
      const actualRole = await signIn(email.trim(), password)
      const destination = destinationForRole(actualRole)
      const selectedRoleMatches =
        (selectedRole === 'APPLICANT' && actualRole === 'applicant') ||
        (selectedRole === 'COMPANY' && actualRole === 'company')

      if (!selectedRoleMatches) {
        setRoleMismatch({ label: roleLabel(actualRole), destination })
        return
      }

      navigate(destination, { replace: true })
    } catch (error) {
      setRequestError(
        error instanceof AuthApiError
          ? error.message
          : 'Login belum dapat diproses. Silakan coba kembali.',
      )
    }
  })

  return (
    <Card
      aria-labelledby="login-title"
      className={`${styles.card} ${styles.loginCard}`}
      padding="none"
    >
      <header className={styles.heading}>
        <h1 id="login-title">Masuk ke GirlBoss</h1>
        <p>Pilih jenis akun Anda untuk melanjutkan</p>
      </header>

      <form className={styles.form} noValidate onSubmit={submit}>
        <RoleSelector<PublicRole>
          label="Masuk sebagai"
          onChange={setSelectedRole}
          options={roleOptions}
          value={selectedRole}
        />

        <FormField
          id="email"
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

        <PasswordField
          error={errors.password?.message}
          id="password"
          label="Password"
          placeholder="Masukkan password"
          registration={register('password')}
        />

        {sessionError && !requestError && (
          <AuthNotice variant="info">{sessionError}</AuthNotice>
        )}
        {requestError && <AuthNotice>{requestError}</AuthNotice>}
        {roleMismatch && (
          <AuthNotice variant="info">
            Akun Anda terdaftar sebagai {roleMismatch.label}. Lanjutkan ke
            halaman akun yang sesuai.
            <Link
              className={styles.noticeLink}
              to={roleMismatch.destination}
              onClick={() => setRoleMismatch(null)}
            >
              Buka halaman {roleMismatch.label}
            </Link>
          </AuthNotice>
        )}

        <Button
          className={styles.submitButton}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? 'Memeriksa akun...'
            : `Masuk sebagai ${selectedRole === 'APPLICANT' ? 'Jobseeker' : 'Employer'}`}
        </Button>
      </form>

      <p className={styles.footerText}>
        Belum punya akun?{' '}
        <Link className={styles.link} to={routePaths.register}>
          Daftar di sini
        </Link>
      </p>
    </Card>
  )
}
