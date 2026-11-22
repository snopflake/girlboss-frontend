import { zodResolver } from '@hookform/resolvers/zod'
import {
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Globe,
  Lightbulb,
  Link2,
  Palette,
  Plus,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button, FormField, IconButton, Input } from '../../../design-system/components'
import { useSaveApplicantProfile } from '../hooks/useApplicantProfile'
import { useSectionSave } from '../hooks/useSectionSave'
import { portfolioListSchema, type PortfolioListValues } from '../schemas/applicantProfileSchemas'
import type { PortfolioLink } from '../types/applicantProfile.types'
import { createLocalId } from '../utils/profileHelpers'
import { ProfileFormFooter } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import styles from './profileForm.module.css'
import portfolioStyles from './PortfolioForm.module.css'

const maxLinks = 10

/** Ikon generik berdasarkan domain (lucide-react v1 tidak memuat ikon brand). */
function iconForUrl(url: string): LucideIcon {
  let host: string
  try {
    host = new URL(url).hostname.toLowerCase()
  } catch {
    return Globe
  }
  if (host.includes('github') || host.includes('gitlab')) return Code2
  if (host.includes('linkedin')) return BriefcaseBusiness
  if (host.includes('behance') || host.includes('dribbble')) return Palette
  return Globe
}

function isSafeHttpUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

interface PortfolioFormProps {
  links: PortfolioLink[]
  onDirtyChange(isDirty: boolean): void
}

export function PortfolioForm({ links, onDirtyChange }: PortfolioFormProps) {
  const { save, status, resetStatus, isSaving } = useSectionSave(useSaveApplicantProfile())
  const {
    control,
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isDirty },
  } = useForm<PortfolioListValues>({
    resolver: zodResolver(portfolioListSchema),
    defaultValues: { links },
    mode: 'onTouched',
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'links', keyName: 'key' })
  const values = useWatch({ control, name: 'links' }) ?? []

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  function addLink() {
    append({ id: createLocalId('link'), label: '', url: '' })
    window.setTimeout(() => setFocus(`links.${fields.length}.label`), 0)
  }

  const submit = handleSubmit((formValues) =>
    save({ portfolioLinks: formValues.links }, 'Portofolio berhasil disimpan.', (profile) =>
      reset({ links: profile.portfolioLinks }),
    ),
  )

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <ProfileSectionCard
        title="Portofolio & Proyek"
        description="Tampilkan karya Anda melalui tautan proyek dan profil online"
        action={
          <Button
            variant="outline"
            className={styles.brandOutline}
            leadingIcon={<Plus size={16} />}
            onClick={addLink}
            disabled={fields.length >= maxLinks}
          >
            Tambah Tautan
          </Button>
        }
        footer={
          <ProfileFormFooter
            isDirty={isDirty}
            isSaving={isSaving}
            status={status}
            onCancel={() => {
              reset({ links })
              resetStatus()
            }}
          />
        }
      >
        {fields.length === 0 ? (
          <p className={styles.emptyNote}>Belum ada tautan portofolio.</p>
        ) : (
          <ul className={styles.tintedList}>
            {fields.map((field, index) => {
              const itemErrors = errors.links?.[index]
              const current = values[index]
              const title = current?.label || `Tautan ${index + 1}`
              const Icon = iconForUrl(current?.url ?? '')
              const canOpen = isSafeHttpUrl(current?.url ?? '') && !itemErrors?.url

              return (
                <li key={field.key} className={[styles.tinted, portfolioStyles.row].join(' ')}>
                  <span className={styles.tintedIcon} aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <fieldset className={[styles.entryFields, styles.grid2].join(' ')}>
                    <legend className={styles.visuallyHidden}>{title}</legend>
                    <FormField id={`link-${field.key}-label`} label="Nama Tautan" required error={itemErrors?.label?.message}>
                      {(controlProps) => (
                        <Input {...controlProps} {...register(`links.${index}.label`)} placeholder="mis. GitHub Profile" />
                      )}
                    </FormField>
                    <FormField id={`link-${field.key}-url`} label="URL" required error={itemErrors?.url?.message}>
                      {(controlProps) => (
                        <Input
                          {...controlProps}
                          {...register(`links.${index}.url`)}
                          type="url"
                          inputMode="url"
                          placeholder="https://"
                          startAdornment={<Link2 size={16} />}
                        />
                      )}
                    </FormField>
                  </fieldset>
                  <div className={[styles.rowActions, portfolioStyles.actions].join(' ')}>
                    {canOpen ? (
                      <a
                        href={current?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={portfolioStyles.openLink}
                        aria-label={`Buka ${title} di tab baru`}
                      >
                        <ExternalLink aria-hidden="true" size={16} />
                      </a>
                    ) : (
                      <span className={portfolioStyles.openPlaceholder} aria-hidden="true" />
                    )}
                    <IconButton
                      size="small"
                      className={styles.danger}
                      icon={<Trash2 size={16} />}
                      aria-label={`Hapus ${title}`}
                      onClick={() => remove(index)}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className={styles.infoBox}>
          <p className={portfolioStyles.tipTitle}>
            <Lightbulb aria-hidden="true" size={14} />
            Tips:
          </p>
          <p>
            Tautan portofolio membantu perusahaan menilai karya Anda. Sertakan GitHub,
            website pribadi, Behance, atau proyek relevan lainnya.
          </p>
        </div>
      </ProfileSectionCard>
    </form>
  )
}
