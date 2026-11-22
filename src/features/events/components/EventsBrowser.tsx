import { CalendarX2, CircleAlert, SearchX } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { Button } from '../../../design-system/components'
import { useEvents } from '../hooks/useEvents'
import type { EventCategoryFilter as Filter } from '../types/event.types'
import { EventCalendar } from './EventCalendar'
import { EventCard } from './EventCard'
import { EventCategoryFilter } from './EventCategoryFilter'
import { EventsSkeleton } from './EventsSkeleton'
import { EventsStateCard } from './EventsStateCard'
import { EventViewToggle, type EventViewMode } from './EventViewToggle'
import styles from './EventsBrowser.module.css'

interface EventsBrowserProps {
  /** Path detail sesuai konteks (publik atau pelamar). */
  getDetailPath(id: string): string
  initialView?: EventViewMode
}

/** Tampilan daftar event (List & Calendar) yang dipakai halaman publik dan pelamar. */
export function EventsBrowser({ getDetailPath, initialView = 'list' }: EventsBrowserProps) {
  const headingId = useId()
  const panelId = useId()
  const eventsQuery = useEvents()
  const [view, setView] = useState<EventViewMode>(initialView)
  const [category, setCategory] = useState<Filter>('all')

  const events = useMemo(() => eventsQuery.data ?? [], [eventsQuery.data])

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      all: events.length,
      workshop: 0,
      webinar: 0,
      'career-fair': 0,
      networking: 0,
    }
    for (const event of events) result[event.category] += 1
    return result
  }, [events])

  const filtered =
    category === 'all' ? events : events.filter((event) => event.category === category)

  let content
  if (eventsQuery.isPending) {
    content = <EventsSkeleton label="Memuat daftar event…" />
  } else if (eventsQuery.isError) {
    content = (
      <EventsStateCard
        icon={CircleAlert}
        tone="danger"
        role="alert"
        title="Gagal memuat event"
        description="Daftar event tidak dapat dimuat. Periksa koneksi lalu coba lagi."
        action={
          <Button
            variant="outline"
            onClick={() => void eventsQuery.refetch()}
            disabled={eventsQuery.isFetching}
          >
            {eventsQuery.isFetching ? 'Memuat ulang…' : 'Coba Lagi'}
          </Button>
        }
      />
    )
  } else if (events.length === 0) {
    content = (
      <EventsStateCard
        icon={CalendarX2}
        title="Belum ada event"
        description="Event, workshop, dan webinar terbaru akan muncul di sini. Cek kembali nanti, ya!"
      />
    )
  } else if (view === 'calendar') {
    content = <EventCalendar events={events} getDetailPath={getDetailPath} />
  } else {
    content = (
      <>
        <EventCategoryFilter value={category} onChange={setCategory} counts={counts} />
        {filtered.length > 0 ? (
          <ul className={styles.grid} aria-label="Daftar event">
            {filtered.map((event) => (
              <li key={event.id}>
                <EventCard event={event} detailPath={getDetailPath(event.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <EventsStateCard
            icon={SearchX}
            title="Belum ada event di kategori ini"
            description="Coba pilih kategori lain atau lihat semua event."
            action={
              <Button variant="outline" onClick={() => setCategory('all')}>
                Lihat Semua Event
              </Button>
            }
          />
        )}
      </>
    )
  }

  return (
    <section className={styles.page} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h1 id={headingId} className={styles.title}>
          Event &amp; Workshop
        </h1>
        <p className={styles.description}>
          Ikuti berbagai event, workshop, dan webinar untuk mengembangkan karir dan
          memperluas network profesional Anda.
        </p>
      </header>

      <EventViewToggle value={view} onChange={setView} panelId={panelId} />

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${view}`}
        className={styles.panel}
      >
        {content}
      </div>
    </section>
  )
}
