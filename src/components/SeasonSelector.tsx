import type { SeasonOption } from '../types/ergast'

type SeasonSelectorProps = {
  seasons: SeasonOption[]
  value: string
  onChange: (season: string) => void
}

export function SeasonSelector({ seasons, value, onChange }: SeasonSelectorProps) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-white/70">
      Season
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-white shadow-inner transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        {seasons.map((season) => (
          <option key={season.value} value={season.value} className="text-black">
            {season.label}
          </option>
        ))}
      </select>
    </label>
  )
}

