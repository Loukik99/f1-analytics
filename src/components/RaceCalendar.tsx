import { parseISO } from 'date-fns'
import type { RaceSummary } from '../types/ergast'
import { formatRaceDate, formatRaceTime } from '../utils/format'

type RaceCalendarProps = {
  races: RaceSummary[]
  selectedRound: number | null
  onSelect: (race: RaceSummary) => void
}

type RaceWithState = RaceSummary & {
  isUpcoming: boolean
  isNext: boolean
}

function enrichRaces(races: RaceSummary[]): RaceWithState[] {
  if (!races.length) return []

  const now = new Date()
  const racesWithMeta = races.map((race) => {
    const iso = race.time ? `${race.date}T${race.time}` : race.date
    let raceDate = new Date(race.date)

    try {
      raceDate = parseISO(iso)
    } catch {
      // ignore parsing issues
    }

    const isUpcoming = raceDate >= now

    return {
      ...race,
      isUpcoming,
      isNext: false,
    }
  })

  const nextRaceIndex = racesWithMeta.findIndex((race) => race.isUpcoming)
  if (nextRaceIndex >= 0) {
    racesWithMeta[nextRaceIndex].isNext = true
  }

  return racesWithMeta
}

export function RaceCalendar({ races, selectedRound, onSelect }: RaceCalendarProps) {
  const enriched = enrichRaces(races)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {enriched.map((race) => {
        const isSelected = selectedRound === race.round
        return (
          <button
            key={race.round}
            onClick={() => onSelect(race)}
            className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
              isSelected
                ? 'border-accent bg-accent/10 shadow-lg shadow-accent/30'
                : 'border-white/5 bg-surface/60 hover:border-accent/60 hover:bg-surface/80'
            }`}
          >
            <div className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wide">
              <span className="text-white/50">Round {race.round}</span>
              {race.isNext ? (
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-accent">
                  Next race
                </span>
              ) : race.isUpcoming ? (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/70">
                  Upcoming
                </span>
              ) : (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-white/40">
                  Completed
                </span>
              )}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">{race.raceName}</h3>
            <p className="text-sm text-white/60">
              {race.locality}, {race.country}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/50">
              <span>{formatRaceDate(race.date, race.time)}</span>
              <span>{formatRaceTime(race.date, race.time)}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

