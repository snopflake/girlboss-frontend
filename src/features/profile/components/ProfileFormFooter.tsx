import { Button } from '../../../design-system/components'
import styles from './ProfileFormFooter.module.css'

export type SaveStatus =
  | { type: 'idle' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }

interface ProfileFormFooterProps {
  isDirty: boolean
  isSaving: boolean
  status: SaveStatus
  onCancel(): void
  saveLabel?: string
  cancelLabel?: string
  /** Default: sama dengan isDirty. */
  canCancel?: boolean
}

/** Footer form profil: pesan status + tombol Batal & Simpan (submit). */
export function ProfileFormFooter({
  isDirty,
  isSaving,
  status,
  onCancel,
  saveLabel = 'Simpan Perubahan',
  cancelLabel = 'Batal',
  canCancel = isDirty,
}: ProfileFormFooterProps) {
  return (
    <>
      <p
        className={[styles.status, status.type !== 'idle' ? styles[status.type] : '']
          .filter(Boolean)
          .join(' ')}
        role={status.type === 'error' ? 'alert' : 'status'}
      >
        {status.type !== 'idle' ? status.message : ''}
      </p>
      <Button variant="outline" onClick={onCancel} disabled={!canCancel || isSaving}>
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={!isDirty || isSaving}>
        {isSaving ? 'Menyimpan…' : saveLabel}
      </Button>
    </>
  )
}
