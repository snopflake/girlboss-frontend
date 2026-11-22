import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin, Pencil, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormField, Input, Select, Textarea } from '../../../design-system/components'
import { useSaveApplicantProfile } from '../hooks/useApplicantProfile'
import { personalInfoSchema, type PersonalInfoValues } from '../schemas/applicantProfileSchemas'
import type { PersonalInfo } from '../types/applicantProfile.types'
import { ProfileFormFooter, type SaveStatus } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import styles from './profileForm.module.css'

interface PersonalInfoFormProps {
  personal: PersonalInfo
  onDirtyChange(isDirty: boolean): void
}

export function PersonalInfoForm({ personal, onDirtyChange }: PersonalInfoFormProps) {
  const saveMutation = useSaveApplicantProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState<SaveStatus>({ type: 'idle' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personal,
    mode: 'onTouched',
  })

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  const submit = handleSubmit((values) => {
    setStatus({ type: 'idle' })
    saveMutation.mutate(
      { personal: { ...personal, ...values } },
      {
        onSuccess: (profile) => {
          reset(profile.personal)
          setIsEditing(false)
          setStatus({ type: 'success', message: 'Info pribadi berhasil disimpan.' })
        },
        onError: () =>
          setStatus({ type: 'error', message: 'Gagal menyimpan. Coba lagi.' }),
      },
    )
  })

  function cancel() {
    reset(personal)
    setIsEditing(false)
    setStatus({ type: 'idle' })
  }

  const readOnly = !isEditing

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <ProfileSectionCard
        title="Informasi Pribadi"
        description="Kelola data diri dan informasi kontak Anda"
        action={
          !isEditing && (
            <Button
              variant="outline"
              className={styles.brandOutline}
              leadingIcon={<Pencil size={16} />}
              onClick={() => {
                setStatus({ type: 'idle' })
                setIsEditing(true)
              }}
            >
              Edit Bagian
            </Button>
          )
        }
        footer={
          isEditing ? (
            <ProfileFormFooter
              isDirty={isDirty}
              isSaving={saveMutation.isPending}
              status={status}
              onCancel={cancel}
            />
          ) : status.type !== 'idle' ? (
            <p className={styles.tip} role="status">
              {status.message}
            </p>
          ) : undefined
        }
      >
        <div className={readOnly ? styles.readOnly : undefined}>
          <FormField
            id="profile-headline"
            label="Headline Profesional"
            required
            hint="Tampil di bagian atas profil dan hasil pencarian perusahaan"
            error={errors.headline?.message}
          >
            {(controlProps) => (
              <Input
                {...controlProps}
                {...register('headline')}
                readOnly={readOnly}
                placeholder="mis. Frontend Developer | React & TypeScript"
              />
            )}
          </FormField>
        </div>

        <hr className={styles.divider} />

        <div className={[styles.grid2, readOnly ? styles.readOnly : ''].filter(Boolean).join(' ')}>
          <FormField id="profile-name" label="Nama Lengkap" required error={errors.fullName?.message}>
            {(controlProps) => (
              <Input {...controlProps} {...register('fullName')} readOnly={readOnly} autoComplete="name" />
            )}
          </FormField>

          <FormField
            id="profile-email"
            label="Alamat Email"
            required
            hint="Email mengikuti akun login dan tidak dapat diubah di sini"
          >
            {(controlProps) => (
              <Input
                {...controlProps}
                {...register('email')}
                type="email"
                readOnly
                startAdornment={<Mail size={16} />}
              />
            )}
          </FormField>

          <FormField id="profile-phone" label="Nomor Telepon" required error={errors.phone?.message}>
            {(controlProps) => (
              <Input
                {...controlProps}
                {...register('phone')}
                type="tel"
                readOnly={readOnly}
                autoComplete="tel"
                startAdornment={<Phone size={16} />}
                placeholder="+62 812-3456-7890"
              />
            )}
          </FormField>

          <FormField id="profile-dob" label="Tanggal Lahir">
            {(controlProps) => (
              <Input {...controlProps} {...register('dateOfBirth')} type="date" readOnly={readOnly} />
            )}
          </FormField>

          <FormField id="profile-gender" label="Gender (Opsional)">
            {(controlProps) => (
              <Select {...controlProps} {...register('gender')} disabled={readOnly}>
                <option value="">Pilih</option>
                <option value="female">Perempuan</option>
                <option value="prefer-not-to-say">Tidak ingin menyebutkan</option>
              </Select>
            )}
          </FormField>

          <FormField id="profile-nationality" label="Kewarganegaraan">
            {(controlProps) => (
              <Input {...controlProps} {...register('nationality')} readOnly={readOnly} />
            )}
          </FormField>

          <div className={styles.full}>
            <FormField id="profile-address" label="Alamat Saat Ini" error={errors.address?.message}>
              {(controlProps) => (
                <span className={styles.textareaWithIcon}>
                  <MapPin aria-hidden="true" size={16} />
                  <Textarea
                    {...controlProps}
                    {...register('address')}
                    readOnly={readOnly}
                    rows={2}
                    autoComplete="street-address"
                  />
                </span>
              )}
            </FormField>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={readOnly ? styles.readOnly : undefined}>
          <FormField
            id="profile-summary"
            label="Tentang Saya / Ringkasan Profesional"
            hint="Tips: ringkasan yang menarik dapat meningkatkan minat perusahaan secara signifikan"
            error={errors.summary?.message}
          >
            {(controlProps) => (
              <Textarea
                {...controlProps}
                {...register('summary')}
                readOnly={readOnly}
                rows={4}
                placeholder="Ceritakan tentang diri, pengalaman, keahlian, dan tujuan karier Anda..."
              />
            )}
          </FormField>
        </div>
      </ProfileSectionCard>
    </form>
  )
}
