import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Card, IconButton } from '../../../design-system/components'
import type { CareerEvent } from '../types/event.types'
import {
  eventCalendarDate,
  formatEventDate,
  formatEventTimeRange,
  formatMonthYear,
} from '../utils/eventFormat'
import styles from './EventCalendar.module.css'

const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

interface EventCalendarProps {
  events: CareerEvent[]
  getDetailPath(id: string): string
}

function initialMonth(events: CareerEvent[]) {
  const now = new Date()
  const upcoming = events.find((event) => new Date(event.endsAt) >= now)
  if (upcoming) {
    const { year, month } = eventCalendarDate(upcoming.startsAt)
    return { year, month }
  }
  return { year: now.getFullYear(), month: now.getMonth() }
}

export function EventCalendar({ events, getDetailPath }: EventCalendarProps) {
  const headingId = useId()
  const [view, setView] = useState(() => initialMonth(events))

  const daysInMonth = new Date(Date.UTC(view.year, view.month + 1, 0)).getUTCDate()
  const leadingBlanks = new Date(Date.UTC(view.year, view.month, 1)).getUTCDay()

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CareerEvent[]>()
    for (const event of events) {
      const date = eventCalendarDate(event.startsAt)
      if (date.year !== view.year || date.month !== view.month) continue
      map.set(date.day, [...(map.get(date.day) ?? []), event])
    }
    return map
  }, [events, view])

  const monthEvents = [...eventsByDay.entries()]
    .sort(([a], [b]) => a - b)
    .flatMap(([, items]) => items)

  function shiftMonth(delta: number) {
    setView((current) => {
      const next = new Date(Date.UTC(current.year, current.month + delta, 1))
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() }
    })
  }

  const monthLabel = formatMonthYear(view.year, view.month)

  return (
    <Card variant="outlined" className={styles.calendar}>
      <section aria-labelledby={headingId}>
        <header className={styles.header}>
          <IconButton
            variant="default"
            className={styles.navButton}
            aria-label="Bulan sebelumnya"
            icon={<ChevronLeft size={16} />}
            onClick={() => shiftMonth(-1)}
          />
          <h2 id={headingId} className={styles.month} aria-live="polite">
            {monthLabel}
          </h2>
          <IconButton
            variant="default"
            className={styles.navButton}
            aria-label="Bulan berikutnya"
            icon={<ChevronRight size={16} />}
            onClick={() => shiftMonth(1)}
          />
        </header>

        <div className={styles.weekdays} aria-hidden="true">
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <ol className={styles.grid} aria-label={`Kalender event ${monthLabel}`}>
          {Array.from({ length: leadingBlanks }, (_, index) => (
            <li key={`blank-${index}`} className={styles.blank} aria-hidden="true" />
          ))}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1
            const dayEvents = eventsByDay.get(day) ?? []
            const hasEvents = dayEvents.length > 0

            return (
              <li
                key={day}
                className={[styles.day, hasEvents ? styles.hasEvents : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className={styles.dayNumber} aria-hidden="true">
                  {day}
                </span>
                {hasEvents && (
                  <ul className={styles.dayEvents}>
                    {dayEvents.map((event) => (
                      <li key={event.id}>
                        <Link
                          to={getDetailPath(event.id)}
                          className={[
                            styles.chip,
                            event.isGirlBossEvent ? styles.chipGirlBoss : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          title={event.title}
                          aria-label={`${event.title}, ${formatEventDate(event.startsAt)}, ${formatEventTimeRange(event)}`}
                        >
                          {event.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>

        {/* Agenda ringkas untuk layar kecil, tempat chip di dalam sel terlalu sempit. */}
        <div className={styles.agenda}>
          {monthEvents.length > 0 ? (
            <ul>
              {monthEvents.map((event) => (
                <li key={event.id}>
                  <Link to={getDetailPath(event.id)} className={styles.agendaItem}>
                    <span
                      className={[
                        styles.legendSwatch,
                        event.isGirlBossEvent ? styles.swatchGirlBoss : styles.swatchEvent,
                      ].join(' ')}
                      aria-hidden="true"
                    />
                    <span className={styles.agendaText}>
                      <span className={styles.agendaTitle}>{event.title}</span>
                      <span className={styles.agendaMeta}>
                        {formatEventDate(event.startsAt)} • {formatEventTimeRange(event)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMonth}>Belum ada event pada bulan ini.</p>
          )}
        </div>

        {monthEvents.length === 0 && (
          <p className={[styles.emptyMonth, styles.emptyDesktop].join(' ')} role="status">
            Belum ada event pada bulan ini.
          </p>
        )}

        <ul className={styles.legend} aria-label="Keterangan warna">
          <li>
            <span className={[styles.legendSwatch, styles.swatchEvent].join(' ')} aria-hidden="true" />
            Event Tersedia
          </li>
          <li>
            <span className={[styles.legendSwatch, styles.swatchGirlBoss].join(' ')} aria-hidden="true" />
            GirlBoss Event
          </li>
        </ul>
      </section>
    </Card>
  )
}
