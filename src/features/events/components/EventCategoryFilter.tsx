import { Button } from '../../../design-system/components'
import type { EventCategory, EventCategoryFilter as Filter } from '../types/event.types'
import { eventCategoryLabels } from '../utils/eventFormat'
import styles from './EventCategoryFilter.module.css'

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Semua Event' },
  ...(Object.entries(eventCategoryLabels) as [EventCategory, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
]

interface EventCategoryFilterProps {
  value: Filter
  onChange(value: Filter): void
  counts: Record<Filter, number>
}

export function EventCategoryFilter({ value, onChange, counts }: EventCategoryFilterProps) {
  return (
    <div className={styles.filters} role="group" aria-label="Filter kategori event">
      {filters.map((filter) => {
        const isActive = filter.value === value
        return (
          <Button
            key={filter.value}
            variant={isActive ? 'primary' : 'outline'}
            className={isActive ? undefined : styles.inactive}
            aria-pressed={isActive}
            aria-label={`${filter.label}, ${counts[filter.value]} event`}
            onClick={() => onChange(filter.value)}
          >
            {filter.label}
          </Button>
        )
      })}
    </div>
  )
}
