import type {
  ConstructorStanding,
  Driver,
  DriverRaceResult,
  DriverStanding,
  RaceSummary,
  SeasonOption,
} from '../types/ergast'

const baseDrivers: Driver[] = [
  {
    driverId: 'max_verstappen',
    code: 'VER',
    permanentNumber: '1',
    givenName: 'Max',
    familyName: 'Verstappen',
    nationality: 'Dutch',
    dateOfBirth: '1997-09-30',
  },
  {
    driverId: 'lewis_hamilton',
    code: 'HAM',
    permanentNumber: '44',
    givenName: 'Lewis',
    familyName: 'Hamilton',
    nationality: 'British',
    dateOfBirth: '1985-01-07',
  },
  {
    driverId: 'charles_leclerc',
    code: 'LEC',
    permanentNumber: '16',
    givenName: 'Charles',
    familyName: 'Leclerc',
    nationality: 'Monégasque',
    dateOfBirth: '1997-10-16',
  },
  {
    driverId: 'lando_norris',
    code: 'NOR',
    permanentNumber: '4',
    givenName: 'Lando',
    familyName: 'Norris',
    nationality: 'British',
    dateOfBirth: '1999-11-13',
  },
]

export const mockDrivers: Driver[] = baseDrivers

export const mockDriverStandings: DriverStanding[] = [
  {
    position: 1,
    points: 437,
    wins: 15,
    driver: baseDrivers[0],
    constructors: [
      { constructorId: 'red_bull', name: 'Oracle Red Bull Racing', nationality: 'Austrian' },
    ],
  },
  {
    position: 2,
    points: 289,
    wins: 3,
    driver: baseDrivers[2],
    constructors: [
      { constructorId: 'ferrari', name: 'Scuderia Ferrari', nationality: 'Italian' },
    ],
  },
  {
    position: 3,
    points: 276,
    wins: 0,
    driver: baseDrivers[3],
    constructors: [
      { constructorId: 'mclaren', name: 'McLaren F1 Team', nationality: 'British' },
    ],
  },
  {
    position: 4,
    points: 250,
    wins: 1,
    driver: baseDrivers[1],
    constructors: [
      { constructorId: 'mercedes', name: 'Mercedes-AMG Petronas F1 Team', nationality: 'German' },
    ],
  },
]

export const mockConstructorStandings: ConstructorStanding[] = [
  {
    position: 1,
    points: 782,
    wins: 17,
    constructor: {
      constructorId: 'red_bull',
      name: 'Oracle Red Bull Racing',
      nationality: 'Austrian',
    },
  },
  {
    position: 2,
    points: 562,
    wins: 3,
    constructor: {
      constructorId: 'ferrari',
      name: 'Scuderia Ferrari',
      nationality: 'Italian',
    },
  },
  {
    position: 3,
    points: 504,
    wins: 0,
    constructor: {
      constructorId: 'mclaren',
      name: 'McLaren F1 Team',
      nationality: 'British',
    },
  },
  {
    position: 4,
    points: 470,
    wins: 1,
    constructor: {
      constructorId: 'mercedes',
      name: 'Mercedes-AMG Petronas F1 Team',
      nationality: 'German',
    },
  },
]

export const mockSchedule: RaceSummary[] = [
  {
    round: 1,
    raceName: 'Bahrain Grand Prix',
    date: '2024-03-02',
    time: '15:00:00Z',
    circuitId: 'bahrain',
    circuitName: 'Bahrain International Circuit',
    locality: 'Sakhir',
    country: 'Bahrain',
  },
  {
    round: 2,
    raceName: 'Saudi Arabian Grand Prix',
    date: '2024-03-09',
    time: '17:00:00Z',
    circuitId: 'jeddah',
    circuitName: 'Jeddah Corniche Circuit',
    locality: 'Jeddah',
    country: 'Saudi Arabia',
  },
  {
    round: 3,
    raceName: 'Australian Grand Prix',
    date: '2024-03-24',
    time: '04:00:00Z',
    circuitId: 'albert_park',
    circuitName: 'Albert Park Circuit',
    locality: 'Melbourne',
    country: 'Australia',
  },
  {
    round: 4,
    raceName: 'Japanese Grand Prix',
    date: '2024-04-07',
    time: '05:00:00Z',
    circuitId: 'suzuka',
    circuitName: 'Suzuka Circuit',
    locality: 'Suzuka',
    country: 'Japan',
  },
]

export const mockDriverResultsByDriver: Record<string, DriverRaceResult[]> = {
  max_verstappen: [
    { round: 1, raceName: 'Bahrain Grand Prix', points: 25, position: 1, grid: 1, status: 'Finished' },
    { round: 2, raceName: 'Saudi Arabian Grand Prix', points: 25, position: 1, grid: 2, status: 'Finished' },
    { round: 3, raceName: 'Australian Grand Prix', points: 18, position: 2, grid: 1, status: 'Finished' },
    { round: 4, raceName: 'Japanese Grand Prix', points: 25, position: 1, grid: 1, status: 'Finished' },
  ],
  lewis_hamilton: [
    { round: 1, raceName: 'Bahrain Grand Prix', points: 12, position: 4, grid: 6, status: 'Finished' },
    { round: 2, raceName: 'Saudi Arabian Grand Prix', points: 10, position: 5, grid: 8, status: 'Finished' },
    { round: 3, raceName: 'Australian Grand Prix', points: 15, position: 3, grid: 5, status: 'Finished' },
    { round: 4, raceName: 'Japanese Grand Prix', points: 18, position: 2, grid: 4, status: 'Finished' },
  ],
  charles_leclerc: [
    { round: 1, raceName: 'Bahrain Grand Prix', points: 18, position: 2, grid: 2, status: 'Finished' },
    { round: 2, raceName: 'Saudi Arabian Grand Prix', points: 18, position: 2, grid: 1, status: 'Finished' },
    { round: 3, raceName: 'Australian Grand Prix', points: 25, position: 1, grid: 1, status: 'Finished' },
    { round: 4, raceName: 'Japanese Grand Prix', points: 15, position: 3, grid: 2, status: 'Finished' },
  ],
  lando_norris: [
    { round: 1, raceName: 'Bahrain Grand Prix', points: 15, position: 3, grid: 4, status: 'Finished' },
    { round: 2, raceName: 'Saudi Arabian Grand Prix', points: 12, position: 4, grid: 5, status: 'Finished' },
    { round: 3, raceName: 'Australian Grand Prix', points: 12, position: 4, grid: 3, status: 'Finished' },
    { round: 4, raceName: 'Japanese Grand Prix', points: 12, position: 4, grid: 3, status: 'Finished' },
  ],
}

export const mockSeasons: SeasonOption[] = Array.from({ length: 15 }).map((_, index) => {
  const year = (2024 - index).toString()
  return { value: year, label: year }
})

export function getMockResults(driverId: string): DriverRaceResult[] {
  return mockDriverResultsByDriver[driverId] ?? []
}

