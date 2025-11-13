import { useMemo, useState } from 'react'
import { getTrackShape } from '../data/trackMaps'

type TrackMapProps = {
  circuitId: string
  circuitName: string
  location: string
  country: string
  nextSession?: string
}

export function TrackMap({
  circuitId,
  circuitName,
  location,
  country,
  nextSession,
}: TrackMapProps) {
  const [isHovering, setIsHovering] = useState(false)

  const shape = useMemo(() => getTrackShape(circuitId), [circuitId])

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-background/50 p-6"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <header className="mb-4">
        <h3 className="text-xl font-semibold text-white">{circuitName}</h3>
        <p className="text-sm text-white/60">
          {location}, {country}
        </p>
        {nextSession ? (
          <p className="mt-1 text-xs uppercase tracking-wide text-accent">
            Next session: {nextSession}
          </p>
        ) : null}
      </header>

      <div className="relative mx-auto max-w-[480px]">
        <svg
          viewBox={shape.viewBox}
          className="h-full w-full"
          role="img"
          aria-label={`${circuitName} track map`}
        >
          <defs>
            <linearGradient id="track-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff1801" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>
            <filter id="track-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#track-glow)">
            <path
              d={shape.path}
              fill="none"
              stroke="url(#track-line)"
              strokeWidth={isHovering ? 6 : 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500 ease-out"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: isHovering ? 0 : 600,
              }}
            />
            {shape.pitStraight ? (
              <path
                d={shape.pitStraight}
                fill="none"
                stroke="#ffffff99"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            ) : null}
          </g>
        </svg>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-wide text-white/40">
        <span>Hover to preview racing line</span>
        <span>ID: {circuitId}</span>
      </div>
    </div>
  )
}

