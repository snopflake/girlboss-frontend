import type { LucideIcon } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import styles from './SettingRow.module.css'

export type SettingTone = 'brand' | 'info' | 'success' | 'accent' | 'warning'

/** Daftar baris pengaturan (dipakai bersama SettingRow). */
export function SettingList({ children }: { children: ReactNode }) {
  return <ul className={styles.settings}>{children}</ul>
}

/** Baris pengaturan: ikon, judul, deskripsi, dan kontrol (select/switch). */
export function SettingRow({
  icon: Icon,
  tone,
  title,
  description,
  control,
}: {
  icon: LucideIcon
  tone: SettingTone
  title: string
  description: string
  control: (labelId: string, descriptionId: string) => ReactNode
}) {
  const labelId = useId()
  const descriptionId = useId()

  return (
    <li className={styles.setting}>
      <span className={[styles.settingIcon, styles[tone]].join(' ')} aria-hidden="true">
        <Icon size={16} />
      </span>
      <div className={styles.settingText}>
        <span id={labelId} className={styles.settingTitle}>
          {title}
        </span>
        <span id={descriptionId} className={styles.settingDescription}>
          {description}
        </span>
      </div>
      <div className={styles.settingControl}>{control(labelId, descriptionId)}</div>
    </li>
  )
}
