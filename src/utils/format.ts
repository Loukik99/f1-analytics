import { format, parseISO } from 'date-fns'

export function formatRaceDate(date: string, time?: string) {
  try {
    const isoString = time ? `${date}T${time}` : date
    const parsed = parseISO(isoString)
    return format(parsed, 'EEE, MMM d, yyyy')
  } catch {
    return date
  }
}

export function formatRaceTime(date: string, time?: string) {
  if (!time) {
    return 'TBA'
  }

  try {
    const parsed = parseISO(`${date}T${time}`)
    return format(parsed, 'HH:mm (zzz)')
  } catch {
    return time
  }
}

