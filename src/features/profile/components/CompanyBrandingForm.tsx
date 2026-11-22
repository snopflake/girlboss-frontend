import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Link2 } from 'lucide-react'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormField, Input } from '../../../design-system/components'
import { useSaveCompanyProfile } from '../hooks/useCompanyProfile'
import { useSectionSave } from '../hooks/useSectionSave'
import { companySocialSchema, type CompanySocialValues } from '../schemas/companyProfileSchemas'
import type { CompanySocialLinks } from '../types/companyProfile.types'
import { ImageUploadButton } from './ImageUploadButton'
import { ProfileFormFooter } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import styles from './CompanyBrandingForm.module.css'
import formStyles from './profileForm.module.css'

export interface ImagePreviewState {
  url: string | null
  error: string | null
  select(file: File): void
  clear(): void
}

interface CompanyBrandingFormProps {
  social: CompanySocialLinks
  logo: ImagePreviewState
  cover: ImagePreviewState
  onDirtyChange(isDirty: boolean): void
}

const socialFields: { name: keyof CompanySocialLinks; label: string; placeholder: string }[] = [
  { name: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
  { name: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { name: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/...' },
  { name: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
]

export function CompanyBrandingForm({ social, logo, cover, onDirtyChange }: CompanyBrandingFormProps) {
  const { save, status, resetStatus, isSaving } = useSectionSave(useSaveCompanyProfile())
  const logoNoteId = useId()
  const coverNoteId = useId()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CompanySocialValues>({
    resolver: zodResolver(companySocialSchema),
    defaultValues: social,
    mode: 'onTouched',
  })

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  const submit = handleSubmit((values) =>
    save({ social: values }, 'Tautan media sosial berhasil disimpan.', (profile) =>
      reset(profile.social),
    ),
  )

  return (
    <form onSubmit={submit} noValidate className={formStyles.form}>
      <ProfileSectionCard
        title="Branding & Media"
        description="Kelola identitas visual dan media sosial perusahaan Anda"
        footer={
          <ProfileFormFooter
            isDirty={isDirty}
            isSaving={isSaving}
            status={status}
            onCancel={() => {
              reset(social)
              resetStatus()
            }}
          />
        }
      >
        <section className={styles.media} aria-labelledby={`${logoNoteId}-title`}>
          <h3 id={`${logoNoteId}-title`} className={styles.mediaTitle}>
            Logo Perusahaan
          </h3>
          <div className={styles.logoRow}>
            <span className={styles.logoPreview}>
              {logo.url ? (
                <img src={logo.url} alt="Pratinjau logo perusahaan" />
              ) : (
                <Building2 aria-hidden="true" size={40} strokeWidth={1.75} />
              )}
            </span>
            <div className={styles.mediaInfo}>
              <ImageUploadButton
                label="Unggah Logo Baru"
                className={formStyles.brandOutline}
                onSelect={logo.select}
                describedBy={logoNoteId}
              />
              <ul id={logoNoteId} className={styles.guidelines}>
                <li>
                  Ukuran disarankan: <strong>500×500 piksel</strong>
                </li>
                <li>
                  Format: <strong>PNG, JPG, atau WebP</strong>
                </li>
                <li>
                  Ukuran file maksimal: <strong>2 MB</strong>
                </li>
                <li>Rasio persegi lebih disarankan</li>
              </ul>
              {logo.error && (
                <p className={styles.error} role="alert">
                  {logo.error}
                </p>
              )}
            </div>
          </div>
        </section>

        <hr className={formStyles.divider} />

        <section className={styles.media} aria-labelledby={`${coverNoteId}-title`}>
          <h3 id={`${coverNoteId}-title`} className={styles.mediaTitle}>
            Gambar Cover / Banner
          </h3>
          <div className={styles.coverPreview}>
            {cover.url ? (
              <img src={cover.url} alt="Pratinjau gambar cover perusahaan" />
            ) : (
              <span className={styles.coverPlaceholder}>
                <Building2 aria-hidden="true" size={32} strokeWidth={1.75} />
                Pratinjau Gambar Cover
              </span>
            )}
          </div>
          <div className={styles.coverActions}>
            <ImageUploadButton
              label="Unggah Gambar Cover"
              className={formStyles.brandOutline}
              onSelect={cover.select}
              describedBy={coverNoteId}
            />
            <Button variant="outline" onClick={cover.clear} disabled={!cover.url}>
              Hapus
            </Button>
          </div>
          <ul id={coverNoteId} className={styles.guidelines}>
            <li>
              Ukuran disarankan: <strong>1200×400 piksel</strong>
            </li>
            <li>
              Format: <strong>PNG, JPG, atau WebP</strong>
            </li>
            <li>
              Ukuran file maksimal: <strong>5 MB</strong>
            </li>
            <li>Rasio lebar (3:1) lebih disarankan</li>
          </ul>
          {cover.error && (
            <p className={styles.error} role="alert">
              {cover.error}
            </p>
          )}
          <p className={formStyles.tip}>
            Logo & cover saat ini hanya dipratinjau di perangkat ini sampai layanan unggah tersedia.
          </p>
        </section>

        <hr className={formStyles.divider} />

        <fieldset className={formStyles.entryFields}>
          <legend className={styles.legend}>Profil Media Sosial (Opsional)</legend>
          {socialFields.map((field) => (
            <FormField
              key={field.name}
              id={`social-${field.name}`}
              label={field.label}
              error={errors[field.name]?.message}
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  {...register(field.name)}
                  type="url"
                  inputMode="url"
                  placeholder={field.placeholder}
                  startAdornment={<Link2 size={16} />}
                />
              )}
            </FormField>
          ))}
        </fieldset>
      </ProfileSectionCard>
    </form>
  )
}
