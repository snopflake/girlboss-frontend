import { zodResolver } from '@hookform/resolvers/zod'
import { BriefcaseBusiness, Lightbulb, Plus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button, FormField, IconButton, Input, Textarea } from '../../../design-system/components'
import { useSaveApplicantProfile } from '../hooks/useApplicantProfile'
import { useSectionSave } from '../hooks/useSectionSave'
import { experienceListSchema, type ExperienceListValues } from '../schemas/applicantProfileSchemas'
import type { WorkExperience } from '../types/applicantProfile.types'
import { createLocalId } from '../utils/profileHelpers'
import { ProfileFormFooter } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import styles from './profileForm.module.css'

interface ExperienceFormProps {
  experiences: WorkExperience[]
  onDirtyChange(isDirty: boolean): void
}

const descriptionPlaceholder = [
  '• Jelaskan tanggung jawab utama Anda',
  '• Sebutkan pencapaian dan dampaknya',
  '• Tuliskan teknologi atau tools yang digunakan',
  "• Gunakan angka bila memungkinkan (mis. 'Meningkatkan performa 40%')",
].join('\n')

export function ExperienceForm({ experiences, onDirtyChange }: ExperienceFormProps) {
  const { save, status, resetStatus, isSaving } = useSectionSave(useSaveApplicantProfile())
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { errors, isDirty },
  } = useForm<ExperienceListValues>({
    resolver: zodResolver(experienceListSchema),
    defaultValues: { items: experiences },
    mode: 'onTouched',
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items', keyName: 'key' })
  const items = useWatch({ control, name: 'items' }) ?? []

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  function addExperience() {
    append({
      id: createLocalId('exp'),
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    })
    window.setTimeout(() => setFocus(`items.${fields.length}.position`), 0)
  }

  function toggleCurrent(index: number) {
    const next = !items[index]?.isCurrent
    setValue(`items.${index}.isCurrent`, next, { shouldDirty: true, shouldValidate: true })
    if (next) setValue(`items.${index}.endDate`, '', { shouldDirty: true })
  }

  const submit = handleSubmit((values) =>
    save({ experiences: values.items }, 'Pengalaman kerja berhasil disimpan.', (profile) =>
      reset({ items: profile.experiences }),
    ),
  )

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <ProfileSectionCard
        title="Pengalaman Kerja"
        description="Tambahkan pengalaman profesional dan pencapaian Anda"
        action={
          <Button
            variant="outline"
            className={styles.brandOutline}
            leadingIcon={<Plus size={16} />}
            onClick={addExperience}
          >
            Tambah Pengalaman
          </Button>
        }
        footer={
          <ProfileFormFooter
            isDirty={isDirty}
            isSaving={isSaving}
            status={status}
            onCancel={() => {
              reset({ items: experiences })
              resetStatus()
            }}
          />
        }
      >
        {fields.length === 0 ? (
          <p className={styles.emptyNote}>
            Belum ada pengalaman kerja. Klik “Tambah Pengalaman” untuk menambahkan.
          </p>
        ) : (
          <ol className={styles.entries}>
            {fields.map((field, index) => {
              const itemErrors = errors.items?.[index]
              const isCurrent = items[index]?.isCurrent ?? false
              const title = items[index]?.position || `Pengalaman ${index + 1}`

              return (
                <li key={field.key} className={styles.entry}>
                  <span className={styles.entryMarker} aria-hidden="true">
                    <span className={styles.entryIcon}>
                      <BriefcaseBusiness size={12} />
                    </span>
                  </span>

                  <fieldset className={styles.entryFields}>
                    <legend className={styles.visuallyHidden}>{title}</legend>
                    <FormField id={`exp-${field.key}-position`} label="Posisi" required error={itemErrors?.position?.message}>
                      {(controlProps) => (
                        <Input {...controlProps} {...register(`items.${index}.position`)} placeholder="mis. Frontend Developer" />
                      )}
                    </FormField>
                    <FormField id={`exp-${field.key}-company`} label="Perusahaan" required error={itemErrors?.company?.message}>
                      {(controlProps) => (
                        <Input {...controlProps} {...register(`items.${index}.company`)} placeholder="Nama perusahaan" />
                      )}
                    </FormField>

                    <div className={styles.grid2}>
                      <FormField id={`exp-${field.key}-start`} label="Tanggal Mulai" required error={itemErrors?.startDate?.message}>
                        {(controlProps) => (
                          <Input {...controlProps} {...register(`items.${index}.startDate`)} type="month" />
                        )}
                      </FormField>
                      <FormField id={`exp-${field.key}-end`} label="Tanggal Selesai" error={itemErrors?.endDate?.message}>
                        {(controlProps) => (
                          <span className={styles.inputWithIcon}>
                            <Input
                              {...controlProps}
                              {...register(`items.${index}.endDate`)}
                              type="month"
                              disabled={isCurrent}
                            />
                            <Button
                              variant={isCurrent ? 'primary' : 'outline'}
                              size="small"
                              className={isCurrent ? undefined : styles.brandOutline}
                              aria-pressed={isCurrent}
                              onClick={() => toggleCurrent(index)}
                            >
                              Saat Ini
                            </Button>
                          </span>
                        )}
                      </FormField>
                    </div>

                    <FormField
                      id={`exp-${field.key}-description`}
                      label="Tanggung Jawab & Pencapaian"
                      error={itemErrors?.description?.message}
                    >
                      {(controlProps) => (
                        <Textarea
                          {...controlProps}
                          {...register(`items.${index}.description`)}
                          rows={5}
                          placeholder={descriptionPlaceholder}
                        />
                      )}
                    </FormField>
                    {index === 0 && (
                      <p className={styles.tip}>
                        <Lightbulb aria-hidden="true" size={12} />
                        Tips: gunakan poin-poin dan awali dengan kata kerja aktif agar mudah dibaca.
                      </p>
                    )}
                  </fieldset>

                  <IconButton
                    size="small"
                    className={styles.danger}
                    icon={<Trash2 size={16} />}
                    aria-label={`Hapus ${title}`}
                    onClick={() => remove(index)}
                  />
                </li>
              )
            })}
          </ol>
        )}
      </ProfileSectionCard>
    </form>
  )
}
