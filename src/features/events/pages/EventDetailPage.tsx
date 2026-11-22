import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarDays,
  CalendarSearch,
  CircleAlert,
  CircleCheck,
  Clock,
  Share2,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAuth } from '../../../app/providers/useAuth'
import { routePaths } from '../../../app/router/routePaths'
import { Button, Card } from '../../../design-system/components'
import { EventCover } from '../components/EventCover'
import { EventsSkeleton } from '../components/EventsSkeleton'
import { EventsStateCard } from '../components/EventsStateCard'
import { useEvent, useRegisterForEvent, useToggleSavedEvent } from '../hooks/useEvents'
import type { CareerEventWithParticipation } from '../types/event.types'
import {
  formatEventDate,
  formatEventTimeRange,
  hasEventEnded,
  isEventFull,
  remainingSlots,
} from '../utils/eventFormat'
import styles from './EventDetailPage.module.css'

type Audience = 'public' | 'applicant'

export default function EventDetailPage({ audience = 'public' }: { audience?: Audience }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const headingId = useId()
  const eventQuery = useEvent(id)
  const event = eventQuery.data

  const listPath = audience === 'applicant' ? routePaths.applicant.events : routePaths.eventList
  const backToList = (
    <Button variant="outline" onClick={() => navigate(listPath)}>
      Kembali ke Events
    </Button>
  )

  let content
  if (eventQuery.isPending) {
    content = <EventsSkeleton variant="detail" label="Memuat detail event…" />
  } else if (eventQuery.isError) {
    content = (
      <EventsStateCard
        icon={CircleAlert}
        tone="danger"
        role="alert"
        title="Gagal memuat detail event"
        description="Detail event tidak dapat dimuat. Periksa koneksi lalu coba lagi."
        action={
          <Button
            variant="outline"
            onClick={() => void eventQuery.refetch()}
            disabled={eventQuery.isFetching}
          >
            {eventQuery.isFetching ? 'Memuat ulang…' : 'Coba Lagi'}
          </Button>
        }
      />
    )
  } else if (!event) {
    content = (
      <EventsStateCard
        icon={CalendarSearch}
        title="Event tidak ditemukan"
        description="Event ini mungkin sudah dihapus atau tautannya tidak valid."
        action={backToList}
      />
    )
  } else {
    content = <EventDetail event={event} titleId={headingId} />
  }

  return (
    <section className={styles.page} aria-labelledby={headingId}>
      {!event && (
        <h1 id={headingId} className={styles.visuallyHidden}>
          Detail Event
        </h1>
      )}
      <Link to={listPath} className={styles.backLink}>
        <ArrowLeft aria-hidden="true" size={16} />
        Kembali ke Events
      </Link>
      {content}
    </section>
  )
}

function EventDetail({
  event,
  titleId,
}: {
  event: CareerEventWithParticipation
  titleId: string
}) {
  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <EventCover event={event} size="hero" />

        <Card variant="outlined" className={styles.content}>
          <h1 id={titleId} className={styles.title}>
            {event.title}
          </h1>

          <dl className={styles.facts}>
            <Fact icon={CalendarDays} label="Tanggal">
              <time dateTime={event.startsAt}>{formatEventDate(event.startsAt)}</time>
            </Fact>
            <Fact icon={Clock} label="Waktu">
              {formatEventTimeRange(event)}
            </Fact>
            <Fact icon={Video} label="Lokasi">
              {event.location}
            </Fact>
            <Fact icon={Building2} label="Organizer">
              {event.organizer}
            </Fact>
          </dl>

          <DetailSection title="Tentang Event" large>
            <p className={styles.paragraph}>{event.description}</p>
          </DetailSection>

          <DetailSection title="Agenda">
            <ul className={styles.checkList}>
              {event.agenda.map((item) => (
                <li key={item}>
                  <CircleCheck aria-hidden="true" size={16} className={styles.brandIcon} />
                  {item}
                </li>
              ))}
            </ul>
          </DetailSection>

          {event.speakers.length > 0 && (
            <DetailSection title="Pembicara">
              <ul className={styles.speakers}>
                {event.speakers.map((speaker) => (
                  <li key={speaker.name} className={styles.speaker}>
                    <span className={styles.avatar} aria-hidden="true">
                      <Users size={18} />
                    </span>
                    <span className={styles.speakerText}>
                      <span className={styles.speakerName}>{speaker.name}</span>
                      <span className={styles.speakerRole}>{speaker.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          <DetailSection title="Yang Perlu Disiapkan">
            <ul className={styles.bulletList}>
              {event.preparations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Apa yang Akan Anda Dapatkan">
            <ul className={styles.checkList}>
              {event.benefits.map((item) => (
                <li key={item}>
                  <CircleCheck aria-hidden="true" size={16} className={styles.successIcon} />
                  {item}
                </li>
              ))}
            </ul>
          </DetailSection>
        </Card>
      </div>

      <aside className={styles.aside} aria-label="Pendaftaran event">
        <RegistrationCard event={event} />
      </aside>
    </div>
  )
}

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <div className={styles.fact}>
      <Icon aria-hidden="true" size={16} />
      <div>
        <dt>{label}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  )
}

function DetailSection({
  title,
  large = false,
  children,
}: {
  title: string
  large?: boolean
  children: ReactNode
}) {
  return (
    <section className={styles.section}>
      <h2 className={large ? styles.sectionTitleLarge : styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}

function RegistrationCard({ event }: { event: CareerEventWithParticipation }) {
  const { user, role, status } = useAuth()
  const navigate = useNavigate()
  const registerMutation = useRegisterForEvent()
  const saveMutation = useToggleSavedEvent()
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const noteId = useId()

  const isApplicant = role === 'applicant' && Boolean(user)
  const isGuest = status === 'unauthenticated'
  const isRegistered = event.participation.isRegistered
  const isFull = isEventFull(event)
  const isEnded = hasEventEnded(event)
  const slots = remainingSlots(event)
  const fillPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100))

  function goToLogin() {
    navigate(routePaths.login)
  }

  function register() {
    if (!user) return goToLogin()
    registerMutation.mutate({ eventId: event.id, userId: user.id })
  }

  function toggleSave() {
    if (!user) return goToLogin()
    saveMutation.mutate({ eventId: event.id, userId: user.id })
  }

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: event.summary, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setShareMessage('Tautan event disalin ke clipboard.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setShareMessage('Tautan tidak dapat dibagikan. Salin dari address bar browser.')
    }
  }

  let primaryLabel = `Daftar Sekarang${event.isFree ? ' - Gratis' : ''}`
  let primaryDisabled = registerMutation.isPending
  let note: string | null = null

  if (isRegistered) {
    primaryLabel = 'Sudah Terdaftar'
    primaryDisabled = true
  } else if (isEnded) {
    primaryLabel = 'Event Telah Selesai'
    primaryDisabled = true
  } else if (isFull) {
    primaryLabel = 'Kuota Penuh'
    primaryDisabled = true
  } else if (isGuest) {
    primaryLabel = 'Masuk untuk Mendaftar'
    note = 'Masuk sebagai pelamar untuk mendaftar dan menyimpan event.'
  } else if (!isApplicant) {
    primaryDisabled = true
    note = 'Pendaftaran event hanya tersedia untuk akun pelamar.'
  } else if (registerMutation.isPending) {
    primaryLabel = 'Mendaftarkan…'
  }

  const canSave = isGuest || isApplicant

  return (
    <Card variant="outlined" className={styles.registration}>
      <div className={styles.quota}>
        <div className={styles.quotaRow}>
          <span>Pendaftar</span>
          <span className={styles.quotaValue}>
            {event.registeredCount}/{event.capacity}
          </span>
        </div>
        <div
          className={styles.progress}
          role="progressbar"
          aria-label="Kuota pendaftar terisi"
          aria-valuemin={0}
          aria-valuemax={event.capacity}
          aria-valuenow={event.registeredCount}
          aria-valuetext={`${event.registeredCount} dari ${event.capacity} peserta`}
        >
          <span className={styles.progressFill} style={{ width: `${fillPercent}%` }} />
        </div>
        <span className={styles.slots}>
          {slots > 0 ? `${slots} slot tersisa` : 'Tidak ada slot tersisa'}
        </span>
      </div>

      {isRegistered && (
        <p className={styles.successNote} role="status">
          <CircleCheck aria-hidden="true" size={16} />
          Kamu sudah terdaftar. Detail akses akan dikirim ke email.
        </p>
      )}
      {registerMutation.isError && (
        <p className={styles.errorNote} role="alert">
          {registerMutation.error instanceof Error
            ? registerMutation.error.message
            : 'Pendaftaran gagal. Coba lagi.'}
        </p>
      )}

      <Button
        className={styles.fullWidth}
        disabled={primaryDisabled}
        onClick={isGuest ? goToLogin : register}
        aria-describedby={note ? noteId : undefined}
      >
        {primaryLabel}
      </Button>
      {note && (
        <p id={noteId} className={styles.note}>
          {note}
        </p>
      )}

      <div className={styles.secondaryActions}>
        <Button
          variant="outline"
          size="small"
          className={styles.brandOutline}
          leadingIcon={
            event.participation.isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />
          }
          aria-pressed={event.participation.isSaved}
          disabled={!canSave || saveMutation.isPending}
          onClick={toggleSave}
        >
          {event.participation.isSaved ? 'Tersimpan' : 'Simpan'}
        </Button>
        <Button
          variant="outline"
          size="small"
          className={styles.brandOutline}
          leadingIcon={<Share2 size={16} />}
          onClick={() => void share()}
        >
          Bagikan
        </Button>
      </div>
      {shareMessage && (
        <p className={styles.note} role="status">
          {shareMessage}
        </p>
      )}

      {event.importantNotes.length > 0 && <hr className={styles.divider} />}
      {event.importantNotes.length > 0 && (
        <div className={styles.important}>
          <h2 className={styles.importantTitle}>Informasi Penting</h2>
          <ul>
            {event.importantNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
