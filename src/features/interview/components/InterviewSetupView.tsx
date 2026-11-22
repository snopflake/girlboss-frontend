import { BriefcaseBusiness, Search, Sparkles } from 'lucide-react'
import { Badge, Button, Card, Input, Select, Textarea } from '../../../design-system/components'
import { experienceLevels } from '../mocks/interviewMock'
import type {
  ExperienceLevel,
  JobContext,
  InterviewSource,
} from '../types/interview'
import styles from '../pages/InterviewPage.module.css'

export interface ManualContextFields {
  title: string
  experienceLevel: ExperienceLevel | ''
  description: string
}

interface InterviewSetupViewProps {
  source: InterviewSource
  jobs: JobContext[]
  selectedJobId: string | null
  searchTerm: string
  manualFields: ManualContextFields
  onSourceChange(source: InterviewSource): void
  onSearchChange(value: string): void
  onSelectJob(jobId: string): void
  onManualFieldChange(field: keyof ManualContextFields, value: string): void
  onStart(): void
  onCancel(): void
}

export function InterviewSetupView({
  source,
  jobs,
  selectedJobId,
  searchTerm,
  manualFields,
  onSourceChange,
  onSearchChange,
  onSelectJob,
  onManualFieldChange,
  onStart,
  onCancel,
}: InterviewSetupViewProps) {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('id-ID')
  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company}`
      .toLocaleLowerCase('id-ID')
      .includes(normalizedSearch),
  )
  const manualValid =
    manualFields.title.trim().length > 0 &&
    manualFields.experienceLevel !== ''
  const canStart = source === 'JOB' ? Boolean(selectedJobId) : manualValid

  return (
    <Card className={styles.setupCard}>
      <header className={styles.cardHeader}>
        <span className={styles.cardHeaderIcon} aria-hidden="true">
          <BriefcaseBusiness size={20} />
        </span>
        <div>
          <h2>Pilih Konteks Pekerjaan</h2>
          <p>
            Gunakan konteks pekerjaan untuk membuat latihan lebih terarah.
          </p>
        </div>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Sumber konteks">
        <button
          aria-controls="job-context-panel"
          aria-selected={source === 'JOB'}
          className={`${styles.tab} ${source === 'JOB' ? styles.tabActive : ''}`}
          id="job-context-tab"
          onClick={() => onSourceChange('JOB')}
          role="tab"
          type="button"
        >
          Dari Lowongan
        </button>
        <button
          aria-controls="manual-context-panel"
          aria-selected={source === 'MANUAL'}
          className={`${styles.tab} ${source === 'MANUAL' ? styles.tabActive : ''}`}
          id="manual-context-tab"
          onClick={() => onSourceChange('MANUAL')}
          role="tab"
          type="button"
        >
          Tulis Manual
        </button>
      </div>

      {source === 'JOB' ? (
        <div
          aria-labelledby="job-context-tab"
          className={styles.contextPanel}
          id="job-context-panel"
          role="tabpanel"
        >
          <div className={styles.jobListHeader}>
            <div>
              <h3>Pilih posisi untuk latihan</h3>
              <p>Contoh lowongan lokal, bukan data Saved Jobs atau lamaran.</p>
            </div>
            <Badge variant="neutral">Data contoh</Badge>
          </div>
          <label className={styles.searchField}>
            <span className={styles.visuallyHidden}>
              Cari posisi atau perusahaan
            </span>
            <Input
              aria-label="Cari posisi atau perusahaan"
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              placeholder="Cari posisi atau perusahaan..."
              startAdornment={<Search size={17} />}
              type="search"
              value={searchTerm}
            />
          </label>

          {filteredJobs.length === 0 ? (
            <div className={styles.noResults} role="status">
              Tidak ada contoh lowongan yang cocok.
            </div>
          ) : (
            <fieldset className={styles.jobChoices}>
              <legend className={styles.visuallyHidden}>
                Pilih konteks lowongan
              </legend>
              {filteredJobs.map((job) => (
                <label
                  className={[
                    styles.jobChoice,
                    selectedJobId === job.id ? styles.jobChoiceSelected : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={job.id}
                >
                  <input
                    checked={selectedJobId === job.id}
                    name="interview-job"
                    onChange={() => onSelectJob(job.id)}
                    type="radio"
                    value={job.id}
                  />
                  <span className={styles.jobIcon} aria-hidden="true">
                    <BriefcaseBusiness size={19} />
                  </span>
                  <span className={styles.jobCopy}>
                    <strong title={job.title}>{job.title}</strong>
                    <span>{job.company}</span>
                    <span>{job.employmentType}</span>
                  </span>
                  <span className={styles.radioVisual} aria-hidden="true" />
                </label>
              ))}
            </fieldset>
          )}
        </div>
      ) : (
        <div
          aria-labelledby="manual-context-tab"
          className={styles.manualPanel}
          id="manual-context-panel"
          role="tabpanel"
        >
          <div className={styles.fieldGroup}>
            <label htmlFor="manual-position">Posisi Pekerjaan</label>
            <Input
              id="manual-position"
              onChange={(event) =>
                onManualFieldChange('title', event.currentTarget.value)
              }
              placeholder="Contoh: UX Researcher"
              value={manualFields.title}
            />
            {manualFields.title.trim() === '' && (
              <span className={styles.fieldHint}>
                Posisi pekerjaan wajib diisi.
              </span>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="manual-experience">Tingkat Pengalaman</label>
            <Select
              id="manual-experience"
              onChange={(event) =>
                onManualFieldChange('experienceLevel', event.currentTarget.value)
              }
              value={manualFields.experienceLevel}
            >
              <option value="">Pilih tingkat pengalaman</option>
              {experienceLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
            {manualFields.experienceLevel === '' && (
              <span className={styles.fieldHint}>
                Pilih tingkat pengalaman untuk melanjutkan.
              </span>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="manual-description">
              Deskripsi Singkat Pekerjaan <span>(opsional)</span>
            </label>
            <Textarea
              id="manual-description"
              maxLength={1000}
              onChange={(event) =>
                onManualFieldChange('description', event.currentTarget.value)
              }
              placeholder="Tambahkan tanggung jawab atau kualifikasi yang ingin dilatih..."
              value={manualFields.description}
            />
            <span className={styles.fieldHint}>
              {manualFields.description.length}/1000 karakter
            </span>
          </div>
          <div className={styles.inlineNotice} role="note">
            <Sparkles size={17} aria-hidden="true" />
            Simulasi ini menggunakan jawaban teks, tanpa perekaman suara.
          </div>
        </div>
      )}

      <div className={styles.setupActions}>
        <Button disabled={!canStart} onClick={onStart} type="button">
          Mulai Simulasi
        </Button>
        <Button onClick={onCancel} type="button" variant="outline">
          Batal
        </Button>
      </div>
      <p className={styles.simulationNotice} role="note">
        Pertanyaan dan evaluasi bersifat simulasi lokal; belum dibuat oleh AI.
      </p>
    </Card>
  )
}
