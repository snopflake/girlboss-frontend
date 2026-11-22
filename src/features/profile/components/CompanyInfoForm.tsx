import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Lightbulb, Mail, MapPin, Pencil, Phone } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormField, Input, Select, Textarea } from '../../../design-system/components'
import { useSaveCompanyProfile } from '../hooks/useCompanyProfile'
import { useSectionSave } from '../hooks/useSectionSave'
import { companyInfoSchema, type CompanyInfoValues } from '../schemas/companyProfileSchemas'
import type { CompanyInfo } from '../types/companyProfile.types'
import { companySizeOptions, industryOptions } from '../utils/companyProfileOptions'
import { ProfileFormFooter } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import styles from './profileForm.module.css'

interface CompanyInfoFormProps {
  info: CompanyInfo
  onDirtyChange(isDirty: boolean): void
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <>
      <Lightbulb aria-hidden="true" size={12} /> {children}
    </>
  )
}

export function CompanyInfoForm({ info, onDirtyChange }: CompanyInfoFormProps) {
  const { save, status, resetStatus, isSaving } = useSectionSave(useSaveCompanyProfile())
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CompanyInfoValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: info,
    mode: 'onTouched',
  })

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  const submit = handleSubmit((values) =>
    save({ info: { ...info, ...values } }, 'Informasi perusahaan berhasil disimpan.', (profile) => {
      reset(profile.info)
      setIsEditing(false)
    }),
  )

  function cancel() {
    reset(info)
    setIsEditing(false)
    resetStatus()
  }

  const readOnly = !isEditing
  const readOnlyClass = readOnly ? styles.readOnly : undefined

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <ProfileSectionCard
        title="Informasi Perusahaan"
        description="Kelola informasi perusahaan yang tampil kepada pencari kerja"
        action={
          !isEditing && (
            <Button
              variant="outline"
              className={styles.brandOutline}
              leadingIcon={<Pencil size={16} />}
              onClick={() => {
                resetStatus()
                setIsEditing(true)
              }}
            >
              Edit Bagian
            </Button>
          )
        }
        footer={
          isEditing ? (
            <ProfileFormFooter isDirty={isDirty} isSaving={isSaving} status={status} onCancel={cancel} />
          ) : status.type !== 'idle' ? (
            <p className={styles.tip} role="status">
              {status.message}
            </p>
          ) : undefined
        }
      >
        <div className={[styles.grid2, readOnlyClass].filter(Boolean).join(' ')}>
          <div className={styles.full}>
            <FormField id="company-name" label="Nama Perusahaan" required error={errors.companyName?.message}>
              {(controlProps) => (
                <Input {...controlProps} {...register('companyName')} readOnly={readOnly} autoComplete="organization" />
              )}
            </FormField>
          </div>

          <FormField id="company-industry" label="Sektor Industri" required error={errors.industry?.message}>
            {(controlProps) => (
              <Select {...controlProps} {...register('industry')} disabled={readOnly}>
                <option value="">Pilih industri</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          <FormField id="company-size" label="Ukuran Perusahaan" required error={errors.companySize?.message}>
            {(controlProps) => (
              <Select {...controlProps} {...register('companySize')} disabled={readOnly}>
                <option value="">Pilih ukuran</option>
                {companySizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          <FormField
            id="company-email"
            label="Email Perusahaan"
            required
            hint="Email mengikuti akun login dan tidak dapat diubah di sini"
          >
            {(controlProps) => (
              <Input {...controlProps} {...register('email')} type="email" readOnly startAdornment={<Mail size={16} />} />
            )}
          </FormField>

          <FormField id="company-phone" label="Telepon Perusahaan" required error={errors.phone?.message}>
            {(controlProps) => (
              <Input
                {...controlProps}
                {...register('phone')}
                type="tel"
                readOnly={readOnly}
                autoComplete="tel"
                placeholder="+62 21-1234-5678"
                startAdornment={<Phone size={16} />}
              />
            )}
          </FormField>

          <div className={styles.full}>
            <FormField id="company-website" label="Website Perusahaan" error={errors.website?.message}>
              {(controlProps) => (
                <Input
                  {...controlProps}
                  {...register('website')}
                  type="url"
                  inputMode="url"
                  readOnly={readOnly}
                  placeholder="https://www.perusahaan.co.id"
                  startAdornment={<Globe size={16} />}
                />
              )}
            </FormField>
          </div>

          <div className={styles.full}>
            <FormField
              id="company-address"
              label="Lokasi Kantor Utama"
              required
              hint={<Tip>Tips: alamat lengkap membantu pencari kerja merencanakan perjalanan.</Tip>}
              error={errors.address?.message}
            >
              {(controlProps) => (
                <span className={styles.textareaWithIcon}>
                  <MapPin aria-hidden="true" size={16} />
                  <Textarea {...controlProps} {...register('address')} readOnly={readOnly} rows={2} autoComplete="street-address" />
                </span>
              )}
            </FormField>
          </div>

          <div className={styles.full}>
            <FormField id="company-contact" label="Narahubung Utama" error={errors.contactPerson?.message}>
              {(controlProps) => (
                <Input {...controlProps} {...register('contactPerson')} readOnly={readOnly} placeholder="mis. Diana Pratiwi - HR Manager" />
              )}
            </FormField>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={readOnlyClass}>
          <FormField
            id="company-description"
            label="Deskripsi Perusahaan"
            required
            hint={<Tip>Tips: deskripsi yang menarik dapat meningkatkan jumlah pelamar.</Tip>}
            error={errors.description?.message}
          >
            {(controlProps) => (
              <Textarea
                {...controlProps}
                {...register('description')}
                readOnly={readOnly}
                rows={4}
                placeholder="Ceritakan tentang perusahaan, misi, visi, produk/layanan..."
              />
            )}
          </FormField>
        </div>

        <hr className={styles.divider} />

        <div className={readOnlyClass}>
          <FormField id="company-culture" label="Budaya & Nilai Perusahaan" error={errors.culture?.message}>
            {(controlProps) => (
              <Textarea
                {...controlProps}
                {...register('culture')}
                readOnly={readOnly}
                rows={5}
                placeholder="Jelaskan budaya kerja, lingkungan, dan nilai-nilai utama perusahaan..."
              />
            )}
          </FormField>
        </div>

        <hr className={styles.divider} />

        <div className={readOnlyClass}>
          <FormField
            id="company-benefits"
            label="Benefit & Fasilitas Karyawan"
            hint={<Tip>Tips: informasi benefit yang jelas menarik kandidat berkualitas.</Tip>}
            error={errors.benefits?.message}
          >
            {(controlProps) => (
              <Textarea
                {...controlProps}
                {...register('benefits')}
                readOnly={readOnly}
                rows={5}
                placeholder="Sebutkan benefit dan fasilitas, mis. cuti melahirkan, jam kerja fleksibel, daycare..."
              />
            )}
          </FormField>
        </div>
      </ProfileSectionCard>
    </form>
  )
}
