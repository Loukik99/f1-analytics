export interface Driver {
  driverId: string
  code?: string
  permanentNumber?: string
  givenName: string
  familyName: string
  dateOfBirth?: string
  nationality: string
}

export interface Constructor {
  constructorId: string
  name: string
  nationality: string
}

export interface DriverStanding {
  position: number
  points: number
  wins: number
  driver: Driver
  constructors: Constructor[]
}

export interface ConstructorStanding {
  position: number
  points: number
  wins: number
  constructor: Constructor
}

export interface RaceSummary {
  round: number
  raceName: string
  date: string
  time?: string
  circuitId: string
  circuitName: string
  locality: string
  country: string
}

export interface DriverRaceResult {
  round: number
  raceName: string
  points: number
  position: number
  grid: number
  status: string
}

export interface SeasonOption {
  value: string
  label: string
}

