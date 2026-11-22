import { CalendarHeart } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../../../design-system/components'
import type { CareerEvent } from '../types/event.types'
import { eventCategoryLabels } from '../utils/eventFormat'
import styles from './EventCover.module.css'

interface EventCoverProps {
  event: Pick<CareerEvent, 'title' | 'category' | 'isGirlBossEvent' | 'coverImageUrl'>
  size?: 'card' | 'hero'
}

/**
 * Sampul event dengan fallback: bila URL kosong atau gagal dimuat, tampilkan
 * placeholder bertema GirlBoss (sesuai layer "ImageWithFallback" di Figma).
 */
export function EventCover({ event, size = 'card' }: EventCoverProps) {
  const [hasError, setHasError] = useState(false)
  const showImage = Boolean(event.coverImageUrl) && !hasError

  return (
    <div className={[styles.cover, styles[size]].join(' ')}>
      {showImage ? (
        <img
          className={styles.image}
          src={event.coverImageUrl ?? undefined}
          alt=""
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={styles.placeholder} aria-hidden="true">
          <CalendarHeart size={size === 'hero' ? 56 : 40} strokeWidth={1.5} />
        </div>
      )}

      <div className={styles.badges}>
        {event.isGirlBossEvent && (
          <Badge className={[styles.badge, styles.girlboss].join(' ')}>GirlBoss Event</Badge>
        )}
        <Badge className={[styles.badge, styles.category].join(' ')}>
          {eventCategoryLabels[event.category]}
        </Badge>
      </div>
    </div>
  )
}
