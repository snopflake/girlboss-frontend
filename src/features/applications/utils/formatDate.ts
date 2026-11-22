const locale = 'id-ID'

const dateFormatter = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const longDateFormatter = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const relativeFormatter = new Intl.RelativeTimeFormat('id', { numeric: 'auto' })

/** Contoh: "18 Nov 2026" */
export function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

/** Contoh: "15 Oktober 2025" */
export function formatLongDate(value: string) {
  return longDateFormatter.format(new Date(value))
}

/** Contoh: "18 Nov 2026, 09.12" */
export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value))
}

/** Contoh: "2 hari lalu", "kemarin", "baru saja" */
export function formatRelative(value: string, now = Date.now()) {
  const diffMs = new Date(value).getTime() - now
  const diffMinutes = Math.round(diffMs / 60_000)

  if (Math.abs(diffMinutes) < 1) return 'baru saja'
  if (Math.abs(diffMinutes) < 60) {
    return relativeFormatter.format(diffMinutes, 'minute')
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) {
    return relativeFormatter.format(diffHours, 'hour')
  }

  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 30) {
    return relativeFormatter.format(diffDays, 'day')
  }

  return relativeFormatter.format(Math.round(diffDays / 30), 'month')
}
