import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ConstructorStanding } from '../types/ergast'

type ConstructorStandingsChartProps = {
  data: ConstructorStanding[]
}

const tooltipStyles = {
  backgroundColor: '#16182c',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#fff',
  padding: '12px',
}

export function ConstructorStandingsChart({ data }: ConstructorStandingsChartProps) {
  const chartData = data.map((standing) => ({
    constructor: standing.constructor.name,
    points: standing.points,
    wins: standing.wins,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
        <defs>
          <linearGradient id="constructorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff1801" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#ff1801" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
        <XAxis
          dataKey="constructor"
          stroke="#ffffff99"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis stroke="#ffffff99" tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip
          cursor={{ stroke: '#ffd700', strokeWidth: 1 }}
          contentStyle={tooltipStyles}
          formatter={(value: number, key: string) => {
            if (key === 'points') {
              return [`${value} pts`, 'Points']
            }
            if (key === 'wins') {
              return [`${value}`, 'Wins']
            }
            return [value, key]
          }}
        />
        <Legend wrapperStyle={{ color: '#fff' }} />
        <Area
          type="monotone"
          dataKey="points"
          stroke="#ff1801"
          strokeWidth={3}
          fill="url(#constructorGradient)"
          activeDot={{ r: 6, fill: '#ffd700' }}
        />
        <Area
          type="monotone"
          dataKey="wins"
          stroke="#ffd700"
          strokeWidth={2}
          fill="none"
          dot={{ r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

