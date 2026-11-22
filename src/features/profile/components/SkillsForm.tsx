import { Lightbulb, Plus, X } from 'lucide-react'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { Button, Input } from '../../../design-system/components'
import { useSaveApplicantProfile } from '../hooks/useApplicantProfile'
import { useSectionSave } from '../hooks/useSectionSave'
import { ProfileFormFooter } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import styles from './SkillsForm.module.css'
import formStyles from './profileForm.module.css'

const suggestedSkills = [
  'HTML5',
  'CSS3',
  'Responsive Design',
  'REST APIs',
  'GraphQL',
  'Redux',
  'Vue.js',
  'Webpack',
  'Agile',
  'Git',
  'Leadership',
  'Communication',
]

const maxSkills = 30

interface SkillsFormProps {
  skills: string[]
  onDirtyChange(isDirty: boolean): void
}

function sameSkills(a: string[], b: string[]) {
  return a.length === b.length && a.every((skill, index) => skill === b[index])
}

export function SkillsForm({ skills: savedSkills, onDirtyChange }: SkillsFormProps) {
  const { save, status, resetStatus, isSaving } = useSectionSave(useSaveApplicantProfile())
  const [skills, setSkills] = useState(savedSkills)
  const [draft, setDraft] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const inputId = useId()
  const hintId = useId()

  const isDirty = !sameSkills(skills, savedSkills)

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  function addSkill(value: string) {
    const skill = value.trim()
    if (!skill) {
      setInputError('Tuliskan nama keahlian terlebih dahulu.')
      return false
    }
    if (skill.length > 40) {
      setInputError('Nama keahlian maksimal 40 karakter.')
      return false
    }
    if (skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      setInputError(`“${skill}” sudah ada di daftar keahlian.`)
      return false
    }
    if (skills.length >= maxSkills) {
      setInputError(`Maksimal ${maxSkills} keahlian.`)
      return false
    }
    setInputError(null)
    setSkills((current) => [...current, skill])
    setAnnouncement(`${skill} ditambahkan.`)
    return true
  }

  function handleAdd(event?: { preventDefault(): void }) {
    event?.preventDefault()
    if (addSkill(draft)) setDraft('')
  }

  function removeSkill(skill: string) {
    setSkills((current) => current.filter((item) => item !== skill))
    setAnnouncement(`${skill} dihapus.`)
  }

  const availableSuggestions = suggestedSkills.filter(
    (suggestion) => !skills.some((skill) => skill.toLowerCase() === suggestion.toLowerCase()),
  )

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save({ skills }, 'Keahlian berhasil disimpan.', (profile) => setSkills(profile.skills))
  }

  return (
    <form onSubmit={submit} noValidate className={formStyles.form}>
      <ProfileSectionCard
        title="Keahlian & Kompetensi"
        description="Tampilkan keahlian teknis dan soft skill Anda kepada perusahaan"
        footer={
          <ProfileFormFooter
            isDirty={isDirty}
            isSaving={isSaving}
            status={status}
            onCancel={() => {
              setSkills(savedSkills)
              setInputError(null)
              resetStatus()
            }}
          />
        }
      >
        <div className={styles.addBox}>
          <label htmlFor={inputId} className={styles.addLabel}>
            Tambah Keahlian Baru
          </label>
          <div className={styles.addRow}>
            <Input
              id={inputId}
              value={draft}
              placeholder="mis. Python, Leadership, Figma..."
              invalid={Boolean(inputError)}
              aria-describedby={hintId}
              onChange={(event) => {
                setDraft(event.target.value)
                if (inputError) setInputError(null)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleAdd(event)
              }}
            />
            <Button leadingIcon={<Plus size={16} />} onClick={() => handleAdd()}>
              Tambah
            </Button>
          </div>
          <p id={hintId} className={inputError ? styles.error : formStyles.tip} role={inputError ? 'alert' : undefined}>
            {inputError ?? (
              <>
                <Lightbulb aria-hidden="true" size={12} />
                Tips: tambahkan keahlian teknis (mis. React, Python) dan soft skill (mis. Leadership, Communication).
              </>
            )}
          </p>
        </div>

        <hr className={formStyles.divider} />

        <section className={styles.skillsSection} aria-labelledby={`${inputId}-title`}>
          <h3 id={`${inputId}-title`} className={formStyles.subTitle}>
            Keahlian Anda ({skills.length})
          </h3>
          {skills.length === 0 ? (
            <p className={formStyles.emptyNote}>Belum ada keahlian. Tambahkan minimal 3 keahlian.</p>
          ) : (
            <ul className={styles.chips}>
              {skills.map((skill) => (
                <li key={skill} className={styles.chip}>
                  <span>{skill}</span>
                  <button
                    type="button"
                    className={styles.chipRemove}
                    aria-label={`Hapus ${skill}`}
                    onClick={() => removeSkill(skill)}
                  >
                    <X aria-hidden="true" size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {availableSuggestions.length > 0 && (
            <div className={formStyles.infoBox}>
              <p className={styles.suggestTitle}>
                <Lightbulb aria-hidden="true" size={14} />
                Saran keahlian untuk Anda:
              </p>
              <ul className={styles.suggestions}>
                {availableSuggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      className={styles.suggestion}
                      aria-label={`Tambah keahlian ${suggestion}`}
                      onClick={() => addSkill(suggestion)}
                    >
                      + {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className={formStyles.visuallyHidden} aria-live="polite">
            {announcement}
          </p>
        </section>
      </ProfileSectionCard>
    </form>
  )
}
