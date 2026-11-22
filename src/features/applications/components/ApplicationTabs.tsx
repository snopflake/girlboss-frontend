import { useRef, type KeyboardEvent } from 'react'
import styles from './ApplicationTabs.module.css'

export interface ApplicationTabItem<T extends string> {
  value: T
  label: string
  count: number
}

interface ApplicationTabsProps<T extends string> {
  items: ApplicationTabItem<T>[]
  value: T
  onChange(value: T): void
  panelId: string
  label: string
}

/**
 * Tab dengan jumlah item. Design system belum memiliki komponen Tabs
 * (folder `Tabs` masih kosong), sehingga dibuat lokal untuk fitur ini.
 * Kandidat untuk dipindahkan ke design system setelah dikoordinasikan.
 */
export function ApplicationTabs<T extends string>({
  items,
  value,
  onChange,
  panelId,
  label,
}: ApplicationTabsProps<T>) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % items.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + items.length) % items.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = items.length - 1
    if (nextIndex === null) return

    event.preventDefault()
    onChange(items[nextIndex].value)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {items.map((item, index) => {
        const isSelected = item.value === value

        return (
          <button
            key={item.value}
            ref={(node) => {
              tabRefs.current[index] = node
            }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${item.value}`}
            aria-selected={isSelected}
            aria-controls={panelId}
            tabIndex={isSelected ? 0 : -1}
            className={[styles.tab, isSelected ? styles.selected : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span>{item.label}</span>
            <span className={styles.count} aria-label={`${item.count} lamaran`}>
              {item.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
