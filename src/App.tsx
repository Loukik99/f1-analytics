import { useEffect, useMemo, useState } from 'react'
import { Card } from './components/Card'
import { ConstructorStandingsChart } from './components/ConstructorStandingsChart'
import { DriverComparisonChart } from './components/DriverComparisonChart'
import { DriverStandingsChart } from './components/DriverStandingsChart'
import { LoadingState, ErrorState } from './components/QueryStates'
import { RaceCalendar } from './components/RaceCalendar'
import { SeasonSelector } from './components/SeasonSelector'
import { TrackMap } from './components/TrackMap'
import {
  useAvailableSeasons,
  useConstructorStandings,
  useDriverStandings,
  useDrivers,
  useRaceSchedule,
} from './hooks/useErgastData'
import { formatRaceDate, formatRaceTime } from './utils/format'

function App() {
  const fallbackSeason = (new Date().getFullYear() - 1).toString()
  const [season, setSeason] = useState<string>(fallbackSeason)
  const [selectedRound, setSelectedRound] = useState<number | null>(null)

  const { data: seasons = [], isLoading: isLoadingSeasons } = useAvailableSeasons()
  const {
    data: driverStandings = [],
    isLoading: isLoadingDrivers,
    isError: driverError,
    refetch: refetchDrivers,
  } = useDriverStandings(season)
  const {
    data: constructorStandings = [],
    isLoading: isLoadingConstructors,
    isError: constructorError,
    refetch: refetchConstructors,
  } = useConstructorStandings(season)
  const {
    data: schedule = [],
    isLoading: isLoadingSchedule,
    isError: scheduleError,
    refetch: refetchSchedule,
  } = useRaceSchedule(season)
  const {
    data: drivers = [],
    isLoading: isLoadingDriversList,
    isError: driversError,
    refetch: refetchDriversList,
  } = useDrivers(season)

  useEffect(() => {
    if (!seasons.length) {
      return
    }
    const latestSeason = seasons[0].value
    if (!season || !seasons.some((item) => item.value === season)) {
      setSeason(latestSeason)
    }
  }, [seasons, season])

  useEffect(() => {
    if (!schedule.length) {
      return
    }

    const now = new Date()
    const nextRace =
      schedule.find((race) => {
        const iso = race.time ? `${race.date}T${race.time}` : race.date
        const raceDate = new Date(iso)
        return raceDate >= now
      }) ?? schedule[0]

    setSelectedRound(nextRace.round)
  }, [schedule])

  const activeRace = useMemo(
    () => schedule.find((race) => race.round === selectedRound),
    [schedule, selectedRound],
  )

  const showDriverComparison =
    !isLoadingDriversList && !driversError && drivers.length >= 2 && schedule.length > 0

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,24,1,0.18),_transparent_45%),linear-gradient(160deg,_#05060f,_#0b0d17_50%,_#05060f)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">
              Formula 1 Intelligence
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Race Analytics Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/60">
              Visualise driver and constructor momentum, compare head-to-head rivalries, and
              explore upcoming Grands Prix with interactive track intel. Powered by the Ergast
              API.
            </p>
          </div>
          <div>
            {isLoadingSeasons ? (
              <div className="rounded-xl border border-white/10 bg-background/40 px-4 py-3 text-sm text-white/60">
                Loading seasons…
              </div>
            ) : seasons.length ? (
              <SeasonSelector seasons={seasons} value={season} onChange={setSeason} />
            ) : (
              <ErrorState message="Unable to load seasons" />
            )}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card title="Driver Standings" subtitle={`Season ${season}`}>
            {driverError ? (
              <ErrorState
                message="Unable to load driver standings."
                action={
                  <button
                    onClick={() => refetchDrivers()}
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/80"
                  >
                    Retry
                  </button>
                }
              />
            ) : isLoadingDrivers ? (
              <LoadingState message="Loading driver standings…" />
            ) : (
              <DriverStandingsChart data={driverStandings} />
            )}
          </Card>

          <Card title="Constructor Standings" subtitle={`Season ${season}`}>
            {constructorError ? (
              <ErrorState
                message="Unable to load constructor standings."
                action={
                  <button
                    onClick={() => refetchConstructors()}
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/80"
                  >
                    Retry
                  </button>
                }
              />
            ) : isLoadingConstructors ? (
              <LoadingState message="Loading constructor standings…" />
            ) : (
              <ConstructorStandingsChart data={constructorStandings} />
            )}
          </Card>
        </section>

        <section>
          <Card
            title="Head-to-head comparison"
            subtitle="Select two drivers to compare cumulative points across the season."
          >
            {driversError ? (
              <ErrorState
                message="Unable to load driver list."
                action={
                  <button
                    onClick={() => refetchDriversList()}
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/80"
                  >
                    Retry
                  </button>
                }
              />
            ) : !showDriverComparison ? (
              <LoadingState message="Loading drivers and schedule…" />
            ) : (
              <DriverComparisonChart season={season} drivers={drivers} schedule={schedule} />
            )}
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card
            title="Race Calendar"
            subtitle="Tap a Grand Prix to reveal track details and upcoming sessions."
            className="h-full"
          >
            {scheduleError ? (
              <ErrorState
                message="Unable to load race calendar."
                action={
                  <button
                    onClick={() => refetchSchedule()}
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary/80"
                  >
                    Retry
                  </button>
                }
              />
            ) : isLoadingSchedule ? (
              <LoadingState message="Loading race calendar…" />
            ) : (
              <RaceCalendar
                races={schedule}
                selectedRound={selectedRound}
                onSelect={(race) => setSelectedRound(race.round)}
              />
            )}
          </Card>

          <Card
            title="Track Intel"
            subtitle={
              activeRace
                ? `${activeRace.raceName} • ${formatRaceDate(
                    activeRace.date,
                    activeRace.time,
                  )}`
                : 'Select a race to preview its layout.'
            }
            className="h-full"
          >
            {activeRace ? (
              <TrackMap
                circuitId={activeRace.circuitId}
                circuitName={activeRace.circuitName}
                location={activeRace.locality}
                country={activeRace.country}
                nextSession={
                  activeRace
                    ? `${formatRaceDate(activeRace.date, activeRace.time)} • ${formatRaceTime(
                        activeRace.date,
                        activeRace.time,
                      )}`
                    : undefined
                }
              />
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-background/30 p-6 text-center text-sm text-white/60">
                <span className="text-xl">🏁</span>
                Select a Grand Prix from the calendar to explore its circuit layout.
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  )
}

export default App
