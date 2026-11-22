import { Bell, BellRing, CalendarHeart, Download, Eye, Newspaper, Trash2 } from 'lucide-react'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { Button, Select } from '../../../design-system/components'
import { useSaveApplicantProfile } from '../hooks/useApplicantProfile'
import { useSectionSave } from '../hooks/useSectionSave'
import { defaultPreferences } from '../mocks/applicantProfile.mock'
import type {
  JobAlertFrequency,
  ProfilePreferences,
  ProfileVisibility,
} from '../types/applicantProfile.types'
import { ChangePasswordForm } from './ChangePasswordForm'
import { ProfileFormFooter } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import { SettingList, SettingRow } from './SettingRow'
import { ToggleSwitch } from './ToggleSwitch'
import formStyles from './profileForm.module.css'
import styles from './SettingsPanel.module.css'

interface SettingsPanelProps {
  preferences: ProfilePreferences
  onDirtyChange(isDirty: boolean): void
}

function samePreferences(a: ProfilePreferences, b: ProfilePreferences) {
  return (Object.keys(a) as (keyof ProfilePreferences)[]).every((key) => a[key] === b[key])
}

/** Tab Pengaturan profil pelamar. */
export function SettingsPanel({ preferences: saved, onDirtyChange }: SettingsPanelProps) {
  const { save, status, resetStatus, isSaving } = useSectionSave(useSaveApplicantProfile())
  const [preferences, setPreferences] = useState(saved)
  const isDirty = !samePreferences(preferences, saved)

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  function update<K extends keyof ProfilePreferences>(key: K, value: ProfilePreferences[K]) {
    resetStatus()
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save({ preferences }, 'Preferensi berhasil disimpan.', (profile) =>
      setPreferences(profile.preferences),
    )
  }

  return (
    <div className={styles.stack}>
      <form onSubmit={submit} noValidate className={formStyles.form}>
        <ProfileSectionCard
          title="Privasi & Preferensi"
          description="Atur siapa yang dapat melihat profil Anda dan cara Anda menerima notifikasi"
          footer={
            <ProfileFormFooter
              isDirty={isDirty}
              canCancel={!samePreferences(preferences, defaultPreferences)}
              isSaving={isSaving}
              status={status}
              saveLabel="Simpan Preferensi"
              cancelLabel="Kembalikan Default"
              onCancel={() => {
                setPreferences(defaultPreferences)
                resetStatus()
              }}
            />
          }
        >
          <SettingList>
            <SettingRow
              icon={Eye}
              tone="brand"
              title="Visibilitas Profil"
              description="Atur siapa yang dapat melihat profil Anda"
              control={(labelId, descriptionId) => (
                <Select
                  aria-labelledby={labelId}
                  aria-describedby={descriptionId}
                  value={preferences.visibility}
                  onChange={(event) => update('visibility', event.target.value as ProfileVisibility)}
                >
                  <option value="public">Publik - dapat dilihat semua orang</option>
                  <option value="employers">Hanya perusahaan terverifikasi</option>
                  <option value="private">Privat - hanya saya</option>
                </Select>
              )}
            />
            <SettingRow
              icon={Bell}
              tone="info"
              title="Email Notifikasi Lowongan"
              description="Terima email tentang lowongan yang sesuai dengan profil Anda"
              control={(labelId, descriptionId) => (
                <Select
                  aria-labelledby={labelId}
                  aria-describedby={descriptionId}
                  value={preferences.jobAlerts}
                  onChange={(event) => update('jobAlerts', event.target.value as JobAlertFrequency)}
                >
                  <option value="daily">Ringkasan Harian</option>
                  <option value="weekly">Ringkasan Mingguan</option>
                  <option value="off">Nonaktif</option>
                </Select>
              )}
            />
            <SettingRow
              icon={BellRing}
              tone="success"
              title="Pembaruan Status Lamaran"
              description="Notifikasi saat perusahaan melihat atau memperbarui lamaran Anda"
              control={(labelId, descriptionId) => (
                <ToggleSwitch
                  aria-labelledby={labelId}
                  aria-describedby={descriptionId}
                  checked={preferences.applicationUpdates}
                  onChange={(value) => update('applicationUpdates', value)}
                />
              )}
            />
            <SettingRow
              icon={CalendarHeart}
              tone="accent"
              title="Notifikasi Event & Workshop"
              description="Terima kabar tentang event dan workshop karier"
              control={(labelId, descriptionId) => (
                <ToggleSwitch
                  aria-labelledby={labelId}
                  aria-describedby={descriptionId}
                  checked={preferences.eventNotifications}
                  onChange={(value) => update('eventNotifications', value)}
                />
              )}
            />
            <SettingRow
              icon={Newspaper}
              tone="warning"
              title="Artikel & Sumber Belajar"
              description="Notifikasi tentang artikel dan sumber belajar karier terbaru"
              control={(labelId, descriptionId) => (
                <ToggleSwitch
                  aria-labelledby={labelId}
                  aria-describedby={descriptionId}
                  checked={preferences.articleNotifications}
                  onChange={(value) => update('articleNotifications', value)}
                />
              )}
            />
          </SettingList>
        </ProfileSectionCard>
      </form>

      <AccountSettings />
    </div>
  )
}

function AccountSettings() {
  const accountNoteId = useId()

  return (
    <ProfileSectionCard title="Pengaturan Akun" description="Kelola keamanan dan data akun Anda">
      <ChangePasswordForm />

      <hr className={formStyles.divider} />

      <section className={styles.accountData} aria-labelledby={`${accountNoteId}-title`}>
        <h3 id={`${accountNoteId}-title`} className={formStyles.subTitle}>
          Data Akun
        </h3>
        <Button
          variant="outline"
          className={formStyles.brandOutline}
          leadingIcon={<Download size={16} />}
          disabled
          aria-describedby={accountNoteId}
        >
          Unduh Data Saya
        </Button>
        <Button
          variant="outline"
          className={styles.dangerOutline}
          leadingIcon={<Trash2 size={16} />}
          disabled
          aria-describedby={accountNoteId}
        >
          Hapus Akun
        </Button>
        <p id={accountNoteId} className={formStyles.tip}>
          Penghapusan akun bersifat permanen dan tidak dapat dibatalkan. Kedua fitur ini akan
          tersedia setelah layanan akun terhubung.
        </p>
      </section>
    </ProfileSectionCard>
  )
}
