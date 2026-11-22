import { Camera, Eye, type LucideIcon } from 'lucide-react'
import { useId, useRef, type ReactNode } from 'react'
import { Button, Card } from '../../../design-system/components'
import { imageAccept } from '../utils/imageUpload'
import styles from './ProfileHeader.module.css'

interface ImageSlot {
  url: string | null
  error: string | null
  onSelect(file: File): void
}

interface ProfileHeaderProps {
  title: string
  subtitle: string
  badges: ReactNode
  /** Bulat untuk pelamar, kotak untuk logo perusahaan. */
  avatarShape?: 'circle' | 'square'
  placeholderIcon: LucideIcon
  avatar: ImageSlot
  avatarLabel: string
  /** Opsional: tombol "Ganti Cover" di banner. */
  cover?: ImageSlot
  publicLabel: string
}

function FilePicker({
  label,
  onSelect,
  children,
  className,
  describedBy,
}: {
  label: string
  onSelect(file: File): void
  children: ReactNode
  className: string
  describedBy?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={label}
        aria-describedby={describedBy}
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={imageAccept}
        className={styles.visuallyHidden}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) onSelect(file)
        }}
      />
    </>
  )
}

export function ProfileHeader({
  title,
  subtitle,
  badges,
  avatarShape = 'circle',
  placeholderIcon: PlaceholderIcon,
  avatar,
  avatarLabel,
  cover,
  publicLabel,
}: ProfileHeaderProps) {
  const publicNoteId = useId()
  const noteId = useId()
  const error = avatar.error ?? cover?.error ?? null

  return (
    <Card variant="outlined" padding="none" className={styles.card}>
      <div
        className={styles.banner}
        style={cover?.url ? { backgroundImage: `url("${cover.url}")` } : undefined}
      >
        {cover && (
          <FilePicker
            label="Ganti gambar cover"
            onSelect={cover.onSelect}
            className={styles.coverButton}
            describedBy={noteId}
          >
            <Camera aria-hidden="true" size={14} />
            <span>Ganti Cover</span>
          </FilePicker>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.avatarWrap}>
          <span
            className={[styles.avatar, avatarShape === 'square' ? styles.square : '']
              .filter(Boolean)
              .join(' ')}
          >
            {avatar.url ? (
              <img src={avatar.url} alt={avatarLabel} className={styles.photo} />
            ) : (
              <PlaceholderIcon aria-hidden="true" size={44} strokeWidth={1.75} />
            )}
          </span>
          <FilePicker
            label={avatarLabel}
            onSelect={avatar.onSelect}
            className={styles.cameraButton}
            describedBy={noteId}
          >
            <Camera aria-hidden="true" size={16} />
          </FilePicker>
        </div>

        <div className={styles.identity}>
          <h1 className={styles.name}>{title}</h1>
          <p className={styles.headline}>{subtitle}</p>
          <div className={styles.badges}>{badges}</div>
          <p id={noteId} className={styles.photoNote} role={error ? 'alert' : undefined}>
            {error ?? 'Pratinjau gambar hanya tersimpan di perangkat ini sampai layanan unggah tersedia.'}
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            className={styles.brandOutline}
            leadingIcon={<Eye size={16} />}
            disabled
            aria-describedby={publicNoteId}
          >
            {publicLabel}
          </Button>
          <span id={publicNoteId} className={styles.visuallyHidden}>
            Halaman publik belum tersedia.
          </span>
        </div>
      </div>
    </Card>
  )
}
