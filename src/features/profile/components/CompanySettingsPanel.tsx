import { Bell, BellRing, CalendarHeart, Megaphone, Newspaper, Plus, Users } from 'lucide-react'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { Button } from '../../../design-system/components'
import { useSaveCompanyProfile } from '../hooks/useCompanyProfile'
import { useSectionSave } from '../hooks/useSectionSave'
import { defaultCompanyNotifications } from '../mocks/companyProfile.mock'
import type { CompanyNotificationPreferences } from '../types/companyProfile.types'
import { ChangePasswordForm } from './ChangePasswordForm'
import { ProfileFormFooter } from './ProfileFormFooter'
import { ProfileSectionCard } from './ProfileSectionCard'
import { SettingList, SettingRow, type SettingTone } from './SettingRow'
import { ToggleSwitch } from './ToggleSwitch'
import formStyles from './profileForm.module.css'
import styles from './CompanySettingsPanel.module.css'

type NotificationKey = keyof CompanyNotificationPreferences

const notificationRows: {
  key: NotificationKey
  icon: typeof Bell
  tone: SettingTone
  title: string
  description: string
}[] = [
  {
    key: 'newApplications',
    icon: BellRing,
    tone: 'info',
    title: 'Notifikasi Lamaran Baru',
    description: 'Dapatkan notifikasi saat ada yang melamar lowongan Anda',
  },
  {
    key: 'eventUpdates',
    icon: CalendarHeart,
    tone: 'accent',
    title: 'Pembaruan Event',
    description: 'Kabar tentang event yang Anda buat',
  },
  {
    key: 'articleUpdates',
    icon: Newspaper,
    tone: 'success',
    title: 'Status Artikel',
    description: 'Pembaruan status artikel yang Anda kirim',
  },
  {
    key: 'platformNews',
    icon: Megaphone,
    tone: 'warning',
    title: 'Berita & Pembaruan Platform',
    description: 'Pengumuman penting dari GirlBoss',
  },
]

function samePreferences(a: CompanyNotificationPreferences, b: CompanyNotificationPreferences) {
  return (Object.keys(a) as NotificationKey[]).every((key) => a[key] === b[key])
}

interface CompanySettingsPanelProps {
  notifications: CompanyNotificationPreferences
  onDirtyChange(isDirty: boolean): void
}

export function CompanySettingsPanel({ notifications: saved, onDirtyChange }: CompanySettingsPanelProps) {
  const { save, status, resetStatus, isSaving } = useSectionSave(useSaveCompanyProfile())
  const [notifications, setNotifications] = useState(saved)
  const teamNoteId = useId()
  const isDirty = !samePreferences(notifications, saved)

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    save({ notifications }, 'Preferensi notifikasi berhasil disimpan.', (profile) =>
      setNotifications(profile.notifications),
    )
  }

  return (
    <div className={styles.stack}>
      <form onSubmit={submit} noValidate className={formStyles.form}>
        <ProfileSectionCard
          title="Preferensi Notifikasi Email"
          description="Pilih notifikasi yang ingin Anda terima"
          footer={
            <ProfileFormFooter
              isDirty={isDirty}
              canCancel={!samePreferences(notifications, defaultCompanyNotifications)}
              isSaving={isSaving}
              status={status}
              saveLabel="Simpan Preferensi"
              cancelLabel="Kembalikan Default"
              onCancel={() => {
                setNotifications(defaultCompanyNotifications)
                resetStatus()
              }}
            />
          }
        >
          <SettingList>
            {notificationRows.map((row) => (
              <SettingRow
                key={row.key}
                icon={row.icon}
                tone={row.tone}
                title={row.title}
                description={row.description}
                control={(labelId, descriptionId) => (
                  <ToggleSwitch
                    aria-labelledby={labelId}
                    aria-describedby={descriptionId}
                    checked={notifications[row.key]}
                    onChange={(value) => {
                      resetStatus()
                      setNotifications((current) => ({ ...current, [row.key]: value }))
                    }}
                  />
                )}
              />
            ))}
          </SettingList>
        </ProfileSectionCard>
      </form>

      <ProfileSectionCard
        title="Keamanan Akun"
        description="Kelola password dan pengaturan keamanan akun"
      >
        <ChangePasswordForm />

        <hr className={formStyles.divider} />

        <section className={styles.team} aria-labelledby={`${teamNoteId}-title`}>
          <h3 id={`${teamNoteId}-title`} className={formStyles.subTitle}>
            Akses Anggota Tim
          </h3>
          <div className={styles.teamEmpty}>
            <Users aria-hidden="true" size={32} strokeWidth={1.5} />
            <p className={styles.teamTitle}>Manajemen anggota tim</p>
            <p id={teamNoteId} className={styles.teamText}>
              Undang anggota tim untuk membantu mengelola lowongan dan lamaran. Fitur ini akan
              tersedia setelah layanan akun tim terhubung.
            </p>
            <Button
              variant="outline"
              className={formStyles.brandOutline}
              leadingIcon={<Plus size={16} />}
              disabled
              aria-describedby={teamNoteId}
            >
              Undang Anggota Tim
            </Button>
          </div>
        </section>
      </ProfileSectionCard>
    </div>
  )
}
