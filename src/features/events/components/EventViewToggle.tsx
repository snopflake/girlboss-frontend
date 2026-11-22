import { useRef, type KeyboardEvent } from 'react'
import styles from './EventViewToggle.module.css'

export type EventViewMode = 'list' | 'calendar'

const options: { value: EventViewMode; label: string }[] = [
  { value: 'list', label: 'List View' },
  { value: 'calendar', label: 'Calendar View' },
]

interface EventViewToggleProps {
  value: EventViewMode
  onChange(value: EventViewMode): void
  panelId: string
}

/**
 * Toggle List/Calendar (pola tablist). Design system belum memiliki
 * SegmentedControl (folder masih kosong) — kandidat untuk dipindahkan ke sana.
 */
export function EventViewToggle({ value, onChange, panelId }: EventViewToggleProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div className={styles.toggle} role="tablist" aria-label="Tampilan event">
      {options.map((option, index) => {
        const isSelected = option.value === value
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node
            }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${option.value}`}
            aria-selected={isSelected}
            aria-controls={panelId}
            tabIndex={isSelected ? 0 : -1}
            className={[styles.option, isSelected ? styles.selected : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
