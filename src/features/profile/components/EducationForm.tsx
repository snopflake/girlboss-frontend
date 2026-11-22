import { zodResolver } from '@hookform/resolvers/zod'
import { Award, GraduationCap, Plus, Trash2 } from 'lucide-react'
import { useEffect, useId } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button, FormField, IconButton, Input } from '../../../design-system/components'
import { useSaveApplicantProfile } from '../hooks/useApplicantProfile'
import { useSectionSave } from '../hooks/useSectionSave'
import { educationListSchema, type EducationListValues } from '../schemas/applicantProfileSchemas'
import type { Certification, Education } from '../types/applicantProfile.types'
import { createLocalId } from '../utils/profileHelpers'
import { ProfileFormFooter } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import styles from './profileForm.module.css'

interface EducationFormProps {
  educations: Education[]
  certifications: Certification[]
  onDirtyChange(isDirty: boolean): void
}

export function EducationForm({ educations, certifications, onDirtyChange }: EducationFormProps) {
  const { save, status, resetStatus, isSaving } = useSectionSave(useSaveApplicantProfile())
  const certificationsTitleId = useId()
  const {
    control,
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isDirty },
  } = useForm<EducationListValues>({
    resolver: zodResolver(educationListSchema),
    defaultValues: { educations, certifications },
    mode: 'onTouched',
  })
  const educationFields = useFieldArray({ control, name: 'educations', keyName: 'key' })
  const certificationFields = useFieldArray({ control, name: 'certifications', keyName: 'key' })
  const educationValues = useWatch({ control, name: 'educations' }) ?? []
  const certificationValues = useWatch({ control, name: 'certifications' }) ?? []

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  function addEducation() {
    educationFields.append({
      id: createLocalId('edu'),
      degree: '',
      institution: '',
      startYear: '',
      graduationYear: '',
      gpa: '',
    })
    window.setTimeout(() => setFocus(`educations.${educationFields.fields.length}.degree`), 0)
  }

  function addCertification() {
    certificationFields.append({ id: createLocalId('cert'), name: '', issuer: '', issuedAt: '' })
    window.setTimeout(
      () => setFocus(`certifications.${certificationFields.fields.length}.name`),
      0,
    )
  }

  const submit = handleSubmit((values) =>
    save(
      { educations: values.educations, certifications: values.certifications },
      'Pendidikan & sertifikasi berhasil disimpan.',
      (profile) =>
        reset({ educations: profile.educations, certifications: profile.certifications }),
    ),
  )

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <ProfileSectionCard
        title="Pendidikan"
        description="Tambahkan latar belakang pendidikan dan kualifikasi Anda"
        action={
          <Button
            variant="outline"
            className={styles.brandOutline}
            leadingIcon={<Plus size={16} />}
            onClick={addEducation}
          >
            Tambah Pendidikan
          </Button>
        }
        footer={
          <ProfileFormFooter
            isDirty={isDirty}
            isSaving={isSaving}
            status={status}
            onCancel={() => {
              reset({ educations, certifications })
              resetStatus()
            }}
          />
        }
      >
        {educationFields.fields.length === 0 ? (
          <p className={styles.emptyNote}>Belum ada riwayat pendidikan.</p>
        ) : (
          <ol className={styles.entries}>
            {educationFields.fields.map((field, index) => {
              const itemErrors = errors.educations?.[index]
              const title = educationValues[index]?.degree || `Pendidikan ${index + 1}`
              return (
                <li key={field.key} className={styles.entry}>
                  <span className={styles.entryMarker} aria-hidden="true">
                    <span className={styles.entryIcon}>
                      <GraduationCap size={12} />
                    </span>
                  </span>
                  <fieldset className={styles.entryFields}>
                    <legend className={styles.visuallyHidden}>{title}</legend>
                    <FormField id={`edu-${field.key}-degree`} label="Gelar / Jurusan" required error={itemErrors?.degree?.message}>
                      {(controlProps) => (
                        <Input {...controlProps} {...register(`educations.${index}.degree`)} placeholder="mis. S1 Teknik Informatika" />
                      )}
                    </FormField>
                    <FormField id={`edu-${field.key}-institution`} label="Institusi" required error={itemErrors?.institution?.message}>
                      {(controlProps) => (
                        <Input {...controlProps} {...register(`educations.${index}.institution`)} placeholder="Nama universitas/sekolah" />
                      )}
                    </FormField>
                    <div className={styles.grid3}>
                      <FormField id={`edu-${field.key}-start`} label="Tahun Mulai" required error={itemErrors?.startYear?.message}>
                        {(controlProps) => (
                          <Input {...controlProps} {...register(`educations.${index}.startYear`)} inputMode="numeric" maxLength={4} placeholder="2016" />
                        )}
                      </FormField>
                      <FormField id={`edu-${field.key}-grad`} label="Tahun Lulus" required error={itemErrors?.graduationYear?.message}>
                        {(controlProps) => (
                          <Input {...controlProps} {...register(`educations.${index}.graduationYear`)} inputMode="numeric" maxLength={4} placeholder="2020" />
                        )}
                      </FormField>
                      <FormField id={`edu-${field.key}-gpa`} label="IPK (Opsional)">
                        {(controlProps) => (
                          <Input {...controlProps} {...register(`educations.${index}.gpa`)} placeholder="3.75 / 4.00" />
                        )}
                      </FormField>
                    </div>
                  </fieldset>
                  <IconButton
                    size="small"
                    className={styles.danger}
                    icon={<Trash2 size={16} />}
                    aria-label={`Hapus ${title}`}
                    onClick={() => educationFields.remove(index)}
                  />
                </li>
              )
            })}
          </ol>
        )}

        <hr className={styles.divider} />

        <section className={styles.entryFields} aria-labelledby={certificationsTitleId}>
          <div className={styles.subHeader}>
            <h3 id={certificationsTitleId} className={styles.subTitle}>
              Sertifikasi & Penghargaan
            </h3>
            <Button
              variant="outline"
              className={styles.brandOutline}
              leadingIcon={<Plus size={16} />}
              onClick={addCertification}
            >
              Tambah Sertifikasi
            </Button>
          </div>

          {certificationFields.fields.length === 0 ? (
            <p className={styles.emptyNote}>Belum ada sertifikasi atau penghargaan.</p>
          ) : (
            <ul className={styles.tintedList}>
              {certificationFields.fields.map((field, index) => {
                const itemErrors = errors.certifications?.[index]
                const title = certificationValues[index]?.name || `Sertifikasi ${index + 1}`
                return (
                  <li key={field.key} className={styles.tinted}>
                    <span className={styles.tintedIcon} aria-hidden="true">
                      <Award size={16} />
                    </span>
                    <fieldset className={styles.entryFields}>
                      <legend className={styles.visuallyHidden}>{title}</legend>
                      <FormField id={`cert-${field.key}-name`} label="Nama Sertifikasi" required error={itemErrors?.name?.message}>
                        {(controlProps) => (
                          <Input {...controlProps} {...register(`certifications.${index}.name`)} placeholder="mis. AWS Certified Developer" />
                        )}
                      </FormField>
                      <div className={styles.grid2}>
                        <FormField id={`cert-${field.key}-issuer`} label="Penerbit" required error={itemErrors?.issuer?.message}>
                          {(controlProps) => (
                            <Input {...controlProps} {...register(`certifications.${index}.issuer`)} placeholder="Lembaga penerbit" />
                          )}
                        </FormField>
                        <FormField id={`cert-${field.key}-date`} label="Tanggal Terbit">
                          {(controlProps) => (
                            <Input {...controlProps} {...register(`certifications.${index}.issuedAt`)} type="month" />
                          )}
                        </FormField>
                      </div>
                    </fieldset>
                    <IconButton
                      size="small"
                      className={styles.danger}
                      icon={<Trash2 size={16} />}
                      aria-label={`Hapus ${title}`}
                      onClick={() => certificationFields.remove(index)}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </ProfileSectionCard>
    </form>
  )
}
