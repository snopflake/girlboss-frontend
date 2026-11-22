import { Building2, CalendarDays, Clock, Users, Video } from 'lucide-react'
import { useId } from 'react'
import { Link, useNavigate } from 'react-router'
import { Badge, Button, Card } from '../../../design-system/components'
import type { CareerEventWithParticipation } from '../types/event.types'
import {
  formatEventDate,
  formatEventTimeRange,
  hasEventEnded,
  isEventFull,
} from '../utils/eventFormat'
import { EventCover } from './EventCover'
import styles from './EventCard.module.css'

interface EventCardProps {
  event: CareerEventWithParticipation
  detailPath: string
}

export function EventCard({ event, detailPath }: EventCardProps) {
  const navigate = useNavigate()
  const titleId = useId()
  const isFull = isEventFull(event)
  const isEnded = hasEventEnded(event)
  const organizer = event.isGirlBossEvent ? event.organizer : `by ${event.organizer}`

  let status = null
  if (event.participation.isRegistered) {
    status = <Badge variant="success">Terdaftar</Badge>
  } else if (isEnded) {
    status = <Badge variant="neutral">Selesai</Badge>
  } else if (isFull) {
    status = <Badge variant="danger">Kuota Penuh</Badge>
  }

  return (
    <Card variant="outlined" padding="none" className={styles.card} aria-labelledby={titleId}>
      <EventCover event={event} />

      <div className={styles.body}>
        <h3 id={titleId} className={styles.title}>
          <Link to={detailPath} className={styles.titleLink}>
            {event.title}
          </Link>
        </h3>
        <p className={styles.summary}>{event.summary}</p>

        <ul className={styles.meta}>
          <li>
            <CalendarDays aria-hidden="true" size={16} />
            <time dateTime={event.startsAt}>{formatEventDate(event.startsAt)}</time>
          </li>
          <li>
            <Clock aria-hidden="true" size={16} />
            {formatEventTimeRange(event)}
          </li>
          <li>
            <Video aria-hidden="true" size={16} />
            {event.location}
          </li>
          <li>
            <Building2 aria-hidden="true" size={16} />
            {organizer}
          </li>
        </ul>

        <div className={styles.footer}>
          <span className={styles.capacity}>
            <Users aria-hidden="true" size={16} />
            <span>
              {event.registeredCount}/{event.capacity}
              <span className={styles.visuallyHidden}> peserta terdaftar</span>
            </span>
          </span>
          {status ?? (
            <Button
              size="small"
              className={styles.action}
              onClick={() => navigate(detailPath)}
              aria-label={`Daftar ${event.title}`}
            >
              Daftar
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
