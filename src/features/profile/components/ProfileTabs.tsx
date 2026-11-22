import { useRef, type KeyboardEvent } from 'react'
import styles from './ProfileTabs.module.css'

export interface ProfileTabItem<T extends string> {
  value: T
  label: string
}

interface ProfileTabsProps<T extends string> {
  items: ProfileTabItem<T>[]
  value: T
  onChange(value: T): void
  panelId: string
  label: string
}

/**
 * Tab navigasi profil (pola tablist, aktivasi manual dengan Enter/Space agar
 * konfirmasi perubahan belum tersimpan tidak terpicu saat navigasi panah).
 * Design system belum memiliki Tabs.
 */
export function ProfileTabs<T extends string>({
  items,
  value,
  onChange,
  panelId,
  label,
}: ProfileTabsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = items.length - 1
    if (next === null) return
    event.preventDefault()
    refs.current[next]?.focus()
  }

  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {items.map((tab, index) => {
        const isSelected = tab.value === value
        return (
          <button
            key={tab.value}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${tab.value}`}
            aria-selected={isSelected}
            aria-controls={panelId}
            tabIndex={isSelected ? 0 : -1}
            className={[styles.tab, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
