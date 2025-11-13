import { useEffect, useMemo, useState } from 'react'
import type { TooltipProps } from 'recharts'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDriverResults } from '../hooks/useErgastData'
import type { Driver, DriverRaceResult, RaceSummary } from '../types/ergast'
import { LoadingState } from './QueryStates'

type DriverComparisonChartProps = {
  season: string
  drivers: Driver[]
  schedule: RaceSummary[]
}

type ChartPoint = {
  round: number
  race: string
  date: string
  [driverId: string]: string | number
}

const comparisonTooltipFormatter: TooltipProps<number, string>['formatter'] = (
  value,
  name,
  payload,
) => {
  const basePayload = payload?.payload as Record<string, unknown> | undefined
  const metaKey = `${name}:meta`
  const meta =
    typeof basePayload?.[metaKey] === 'string' ? (basePayload?.[metaKey] as string) : ''
  const formattedValue = typeof value === 'number' ? `${value} pts` : `${value}`
  return [formattedValue, meta]
}

const comparisonLabelFormatter: TooltipProps<number, string>['labelFormatter'] = (
  label,
  payload,
) => {
  const raceName = payload?.[0]?.payload?.race
  if (typeof raceName === 'string' && raceName.length > 0) {
    return raceName
  }

  return typeof label === 'number' ? `Round ${label}` : label
}

function buildCumulativeMap(results: DriverRaceResult[]) {
  const map = new Map<number, { points: number; cumulative: number; position: number }>()
  let total = 0
  results
    .sort((a, b) => a.round - b.round)
    .forEach((result) => {
      total += result.points
      map.set(result.round, {
        points: result.points,
        cumulative: total,
        position: result.position,
      })
    })
  return map
}

function mergeDriverResults(
  schedule: RaceSummary[],
  aId: string,
  aMap: Map<number, { points: number; cumulative: number; position: number }>,
  bId: string,
  bMap: Map<number, { points: number; cumulative: number; position: number }>,
): ChartPoint[] {
  return schedule
    .slice()
    .sort((a, b) => a.round - b.round)
    .map((race) => {
      const aResult = aMap.get(race.round)
      const bResult = bMap.get(race.round)
      const point: ChartPoint = {
        round: race.round,
        race: race.raceName,
        date: race.date,
      }

      if (aResult) {
        point[aId] = aResult.cumulative
        point[`${aId}:meta`] = `${aResult.points} pts • P${aResult.position}`
      }

      if (bResult) {
        point[bId] = bResult.cumulative
        point[`${bId}:meta`] = `${bResult.points} pts • P${bResult.position}`
      }

      return point
    })
}

export function DriverComparisonChart({
  season,
  drivers,
  schedule,
}: DriverComparisonChartProps) {
  const [driverA, setDriverA] = useState('')
  const [driverB, setDriverB] = useState('')

  useEffect(() => {
    if (!drivers.length) return

    setDriverA((current) => {
      if (current && drivers.some((driver) => driver.driverId === current)) {
        return current
      }
      return drivers[0]?.driverId ?? ''
    })

    setDriverB((current) => {
      if (current && drivers.some((driver) => driver.driverId === current)) {
        return current
      }
      return drivers[1]?.driverId ?? drivers[0]?.driverId ?? ''
    })
  }, [drivers])

  const { data: resultsA, isLoading: loadingA } = useDriverResults(season, driverA, true)
  const { data: resultsB, isLoading: loadingB } = useDriverResults(season, driverB, true)

  const chartData = useMemo(() => {
    if (!resultsA || !resultsB || !driverA || !driverB) {
      return []
    }

    const mapA = buildCumulativeMap(resultsA)
    const mapB = buildCumulativeMap(resultsB)

    return mergeDriverResults(schedule, driverA, mapA, driverB, mapB)
  }, [resultsA, resultsB, schedule, driverA, driverB])

  const driverDetails = useMemo(() => {
    const lookup = new Map(drivers.map((driver) => [driver.driverId, driver]))
    return {
      A: lookup.get(driverA),
      B: lookup.get(driverB),
    }
  }, [drivers, driverA, driverB])

  if (!driverA || !driverB) {
    return (
      <div className="text-sm text-white/60">
        Select two drivers to compare their cumulative points progression.
      </div>
    )
  }

  if (loadingA || loadingB) {
    return <LoadingState message="Loading driver comparison…" />
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-white/60">
          Driver A
          <select
            value={driverA}
            onChange={(event) => setDriverA(event.target.value)}
            className="rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {drivers.map((driver) => (
              <option key={driver.driverId} value={driver.driverId} className="text-black">
                {driver.code ?? driver.permanentNumber ?? ''} — {driver.givenName}{' '}
                {driver.familyName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-white/60">
          Driver B
          <select
            value={driverB}
            onChange={(event) => setDriverB(event.target.value)}
            className="rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {drivers.map((driver) => (
              <option key={driver.driverId} value={driver.driverId} className="text-black">
                {driver.code ?? driver.permanentNumber ?? ''} — {driver.givenName}{' '}
                {driver.familyName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
          <XAxis
            dataKey="round"
            stroke="#ffffff99"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            label={{ value: 'Round', position: 'insideBottomRight', fill: '#ffffff80' }}
          />
          <YAxis
            stroke="#ffffff99"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            label={{ value: 'Cumulative Points', angle: -90, fill: '#ffffff80' }}
          />
          <Tooltip<number, string>
            contentStyle={{
              backgroundColor: '#16182c',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              padding: '12px',
            }}
            labelFormatter={comparisonLabelFormatter}
            formatter={comparisonTooltipFormatter}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Line
            type="monotone"
            dataKey={driverA}
            name={
              driverDetails.A
                ? `${driverDetails.A.givenName} ${driverDetails.A.familyName}`
                : 'Driver A'
            }
            stroke="#ff1801"
            strokeWidth={3}
            activeDot={{ r: 6, fill: '#ffd700' }}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey={driverB}
            name={
              driverDetails.B
                ? `${driverDetails.B.givenName} ${driverDetails.B.familyName}`
                : 'Driver B'
            }
            stroke="#00d4ff"
            strokeWidth={3}
            activeDot={{ r: 6, fill: '#00d4ff' }}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-white/50">
        Cumulative points per driver across the selected season. Hover to view per-race points
        earned and finishing position.
      </p>
    </div>
  )
}

