import type {
  CareerEvent,
  CareerEventWithParticipation,
  EventParticipation,
} from '../types/event.types'
import { isEventFull } from '../utils/eventFormat'
import { eventsMock } from './events.mock'

/**
 * Sumber data sementara untuk fitur Event selama backend belum memiliki
 * endpoint event. Saat endpoint tersedia, ganti pemanggilan di
 * `hooks/useEvents.ts` ke modul `api/` tanpa mengubah komponen UI.
 *
 * Mode pratinjau (hanya saat development) melalui query string:
 *   ?mock=empty  → tidak ada event
 *   ?mock=error  → simulasi kegagalan memuat data
 */

const latencyMs = 400

type MockScenario = 'default' | 'empty' | 'error'

function currentScenario(): MockScenario {
  if (!import.meta.env.DEV) return 'default'
  const value = new URLSearchParams(window.location.search).get('mock')
  return value === 'empty' || value === 'error' ? value : 'default'
}

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, latencyMs))
}

export class MockEventsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MockEventsError'
  }
}

let events: CareerEvent[] = eventsMock.map((event) => ({ ...event }))
/** Partisipasi per-pengguna disimpan di memori, dikunci dengan id pengguna. */
const participations = new Map<string, EventParticipation>()

function participationKey(userId: string | undefined, eventId: string) {
  return `${userId ?? 'guest'}:${eventId}`
}

function withParticipation(
  event: CareerEvent,
  userId: string | undefined,
): CareerEventWithParticipation {
  return {
    ...event,
    participation: participations.get(participationKey(userId, event.id)) ?? {
      isRegistered: false,
      isSaved: false,
    },
  }
}

export async function getEventsMock(
  userId: string | undefined,
): Promise<CareerEventWithParticipation[]> {
  await wait()
  const scenario = currentScenario()
  if (scenario === 'error') {
    throw new MockEventsError('Daftar event tidak dapat dimuat.')
  }
  if (scenario === 'empty') return []

  return [...events]
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .map((event) => withParticipation(event, userId))
}

export async function getEventMock(
  id: string,
  userId: string | undefined,
): Promise<CareerEventWithParticipation | null> {
  await wait()
  if (currentScenario() === 'error') {
    throw new MockEventsError('Detail event tidak dapat dimuat.')
  }
  const event = events.find((item) => item.id === id)
  return event ? withParticipation(event, userId) : null
}

export async function registerForEventMock(input: {
  eventId: string
  userId: string
}): Promise<void> {
  await wait()
  const event = events.find((item) => item.id === input.eventId)
  if (!event) throw new MockEventsError('Event tidak ditemukan.')

  const key = participationKey(input.userId, input.eventId)
  const current = participations.get(key) ?? { isRegistered: false, isSaved: false }
  if (current.isRegistered) return
  if (isEventFull(event)) throw new MockEventsError('Kuota event sudah penuh.')

  participations.set(key, { ...current, isRegistered: true })
  events = events.map((item) =>
    item.id === input.eventId
      ? { ...item, registeredCount: item.registeredCount + 1 }
      : item,
  )
}

export async function toggleSavedEventMock(input: {
  eventId: string
  userId: string
}): Promise<boolean> {
  await wait()
  const key = participationKey(input.userId, input.eventId)
  const current = participations.get(key) ?? { isRegistered: false, isSaved: false }
  const next = { ...current, isSaved: !current.isSaved }
  participations.set(key, next)
  return next.isSaved
}
