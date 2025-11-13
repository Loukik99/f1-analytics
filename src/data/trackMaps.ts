export type TrackShape = {
  viewBox: string
  path: string
  pitStraight?: string
}

const PROCEDURAL_SHAPES: TrackShape[] = [
  {
    viewBox: '0 0 120 80',
    path: 'M12 60 C18 22 46 12 68 18 S108 40 102 58 78 70 60 66 38 46 28 52 16 70 24 72',
    pitStraight: 'M16 62 L44 62',
  },
  {
    viewBox: '0 0 120 80',
    path: 'M18 68 C18 34 32 16 52 16 78 16 96 34 96 52 96 70 76 74 60 70 42 66 36 54 26 54 16 54 12 60 18 68',
    pitStraight: 'M26 56 L52 56',
  },
  {
    viewBox: '0 0 120 80',
    path: 'M16 64 C14 40 28 22 52 18 76 14 98 26 100 44 102 62 80 72 58 68 42 66 30 50 24 58 20 64 18 68 16 64',
    pitStraight: 'M30 60 L60 60',
  },
  {
    viewBox: '0 0 120 80',
    path: 'M18 58 C28 18 48 10 70 24 90 36 98 54 84 64 70 74 44 76 32 64 24 56 20 46 18 58',
    pitStraight: 'M24 60 L52 60',
  },
  {
    viewBox: '0 0 120 80',
    path: 'M22 62 C22 28 44 16 66 18 88 20 102 38 94 58 86 78 62 74 44 68 28 62 18 70 22 62',
    pitStraight: 'M30 64 L58 64',
  },
  {
    viewBox: '0 0 120 80',
    path: 'M16 56 C30 24 44 18 68 22 92 26 104 44 92 62 80 80 54 76 36 66 20 56 12 68 16 56',
    pitStraight: 'M22 58 L50 58',
  },
  {
    viewBox: '0 0 120 80',
    path: 'M18 60 C26 32 48 20 70 24 92 28 104 44 90 60 76 76 48 72 34 62 22 52 14 70 18 60',
    pitStraight: 'M26 62 L56 62',
  },
  {
    viewBox: '0 0 120 80',
    path: 'M20 64 C22 32 44 14 68 20 92 26 104 46 90 64 76 82 50 74 32 66 20 60 18 68 20 64',
    pitStraight: 'M24 66 L54 66',
  },
]

export function getTrackShape(circuitId: string): TrackShape {
  if (!circuitId) {
    return PROCEDURAL_SHAPES[0]
  }

  const code = Array.from(circuitId).reduce(
    (acc, char, index) => acc + char.charCodeAt(0) * (index + 3),
    0,
  )

  return PROCEDURAL_SHAPES[code % PROCEDURAL_SHAPES.length]
}

