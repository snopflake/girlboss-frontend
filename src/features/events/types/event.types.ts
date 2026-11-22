export type EventCategory = 'workshop' | 'webinar' | 'career-fair' | 'networking'

export type EventCategoryFilter = EventCategory | 'all'

export interface EventSpeaker {
  name: string
  role: string
}

export interface CareerEvent {
  id: string
  title: string
  summary: string
  description: string
  category: EventCategory
  /** Event yang diselenggarakan langsung oleh tim GirlBoss. */
  isGirlBossEvent: boolean
  /** ISO datetime mulai & selesai. */
  startsAt: string
  endsAt: string
  location: string
  organizer: string
  /** URL sampul dari data; kosong → tampilkan placeholder. */
  coverImageUrl: string | null
  capacity: number
  registeredCount: number
  isFree: boolean
  agenda: string[]
  speakers: EventSpeaker[]
  preparations: string[]
  benefits: string[]
  importantNotes: string[]
}

/** Status partisipasi pengguna saat ini pada sebuah event (mock lokal). */
export interface EventParticipation {
  isRegistered: boolean
  isSaved: boolean
}

export interface CareerEventWithParticipation extends CareerEvent {
  participation: EventParticipation
}
