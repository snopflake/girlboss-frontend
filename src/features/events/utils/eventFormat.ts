import type { CareerEvent, EventCategory } from '../types/event.types'

export const eventCategoryLabels: Record<EventCategory, string> = {
  workshop: 'Workshop',
  webinar: 'Webinar',
  'career-fair': 'Career Fair',
  networking: 'Networking',
}

const timeZone = 'Asia/Jakarta'

const longDate = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone,
})

const time = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone,
})

const monthYear = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
  timeZone,
})

/** Contoh: "25 Oktober 2025" */
export function formatEventDate(value: string) {
  return longDate.format(new Date(value))
}

/** Contoh: "14:00 - 16:00 WIB" */
export function formatEventTimeRange(event: Pick<CareerEvent, 'startsAt' | 'endsAt'>) {
  const format = (value: string) => time.format(new Date(value)).replace('.', ':')
  return `${format(event.startsAt)} - ${format(event.endsAt)} WIB`
}

/** Contoh: "Oktober 2025" */
export function formatMonthYear(year: number, month: number) {
  return monthYear.format(new Date(Date.UTC(year, month, 15)))
}

/** Tanggal kalender (tahun, bulan 0-11, tanggal) event menurut zona WIB. */
export function eventCalendarDate(value: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  })
    .formatToParts(new Date(value))
    .reduce<Record<string, number>>((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = Number(part.value)
      return acc
    }, {})

  return { year: parts.year, month: parts.month - 1, day: parts.day }
}

export function remainingSlots(event: Pick<CareerEvent, 'capacity' | 'registeredCount'>) {
  return Math.max(0, event.capacity - event.registeredCount)
}

export function isEventFull(event: Pick<CareerEvent, 'capacity' | 'registeredCount'>) {
  return remainingSlots(event) === 0
}

export function hasEventEnded(event: Pick<CareerEvent, 'endsAt'>, now = Date.now()) {
  return new Date(event.endsAt).getTime() < now
}
