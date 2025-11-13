import type { CSSProperties } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { DriverStanding } from '../types/ergast'

type DriverStandingsChartProps = {
  data: DriverStanding[]
}

const tooltipStyles: CSSProperties = {
  backgroundColor: '#16182c',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#fff',
  padding: '12px',
  textTransform: 'none',
}

const driverTooltipFormatter: TooltipProps<number, string>['formatter'] = (
  value,
  name,
) => {
  if (typeof value === 'number' && name === 'points') {
    return [`${value} pts`, 'Points']
  }

  if (typeof value === 'number' && name === 'wins') {
    return [`${value}`, 'Wins']
  }

  return [value, name]
}

const driverLabelFormatter: TooltipProps<number, string>['labelFormatter'] = (
  label,
  payload,
) => {
  const entry = payload?.[0]
  const name = entry && typeof entry.payload === 'object' ? entry.payload?.name : undefined
  return typeof name === 'string' && name.length > 0 ? name : label
}

export function DriverStandingsChart({ data }: DriverStandingsChartProps) {
  const chartData = data.slice(0, 10).map((standing) => {
    const fallbackCode =
      standing.driver.familyName?.slice(0, 3).toUpperCase() ??
      standing.driver.driverId.slice(0, 3).toUpperCase()

    return {
      code: standing.driver.code ?? fallbackCode,
    name: `${standing.driver.givenName} ${standing.driver.familyName}`,
    team: standing.constructors[0]?.name ?? '—',
    points: standing.points,
    wins: standing.wins,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
        <XAxis
          dataKey="code"
          stroke="#ffffff99"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis stroke="#ffffff99" tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip<number, string>
          cursor={{ fill: '#ffffff10' }}
          contentStyle={tooltipStyles}
          formatter={driverTooltipFormatter}
          labelFormatter={driverLabelFormatter}
        />
        <Bar
          dataKey="points"
          radius={[8, 8, 0, 0]}
          fill="url(#driverGradient)"
          className="transition-all duration-300 ease-out"
        />
        <defs>
          <linearGradient id="driverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#ff1801" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}

