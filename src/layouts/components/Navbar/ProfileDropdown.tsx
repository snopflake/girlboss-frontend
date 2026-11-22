import { LogOut, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { AuthUser } from '../../../app/providers/AuthContext'
import styles from './ProfileDropdown.module.css'

interface ProfileDropdownProps {
  user: AuthUser | null
  profileHref: string
  onSignOut(): void
}

export function ProfileDropdown({
  user,
  profileHref,
  onSignOut,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function closeOutside(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Buka menu profil"
        className={styles.trigger}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <UserRound aria-hidden="true" size={19} />
      </button>
      {open && (
        <div className={styles.dropdown} aria-label="Menu profil">
          {(user?.fullName || user?.email) && (
            <div className={styles.identity}>
              {user.fullName && (
                <strong className={styles.name}>{user.fullName}</strong>
              )}
              {user.email && <span className={styles.email}>{user.email}</span>}
            </div>
          )}
          <Link
            className={styles.item}
            onClick={() => setOpen(false)}
            to={profileHref}
          >
            <UserRound aria-hidden="true" size={17} />
            Profil Saya
          </Link>
          <div className={styles.divider} />
          <button
            className={`${styles.item} ${styles.logout}`}
            onClick={onSignOut}
            type="button"
          >
            <LogOut aria-hidden="true" size={17} />
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}
