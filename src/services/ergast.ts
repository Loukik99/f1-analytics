import type {
  Constructor,
  ConstructorStanding,
  Driver,
  DriverRaceResult,
  DriverStanding,
  RaceSummary,
  SeasonOption,
} from '../types/ergast'
import {
  getMockResults,
  mockConstructorStandings,
  mockDriverStandings,
  mockDrivers,
  mockSchedule,
  mockSeasons,
} from '../mocks/ergastMock'

const ERGAST_BASE_URL = 'https://ergast.com/api/f1'

async function fetchErgast<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = `${ERGAST_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Ergast API error ${response.status}`)
  }

  return (await response.json()) as T
}

type SeasonsResponse = {
  MRData: {
    SeasonTable: {
      Seasons: Array<{ season: string }>
    }
  }
}

type DriverStandingsResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        round: string
        DriverStandings: Array<{
          position: string
          points: string
          wins: string
          Driver: Driver
          Constructors: Constructor[]
        }>
      }>
    }
  }
}

type ConstructorStandingsResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        round: string
        ConstructorStandings: Array<{
          position: string
          points: string
          wins: string
          Constructor: Constructor
        }>
      }>
    }
  }
}

type RaceScheduleResponse = {
  MRData: {
    RaceTable: {
      Races: Array<{
        round: string
        raceName: string
        date: string
        time?: string
        Circuit: {
          circuitId: string
          circuitName: string
          Location: {
            lat: string
            long: string
            locality: string
            country: string
          }
        }
      }>
    }
  }
}

type DriverResultsResponse = {
  MRData: {
    RaceTable: {
      Races: Array<{
        round: string
        raceName: string
        Results: Array<{
          points: string
          position: string
          grid: string
          status: string
        }>
      }>
    }
  }
}

type DriversResponse = {
  MRData: {
    DriverTable: {
      Drivers: Driver[]
    }
  }
}

export async function getAvailableSeasons(limit = 20): Promise<SeasonOption[]> {
  try {
    const data = await fetchErgast<SeasonsResponse>(
      `/seasons.json?limit=${Math.max(limit, 20)}`,
    )

    const seasons =
      data.MRData.SeasonTable.Seasons?.map((season) => season.season) ?? []

    return seasons
      .reverse()
      .map((season) => ({ value: season, label: season } satisfies SeasonOption))
  } catch (error) {
    console.warn('Ergast seasons fetch failed, using mock data', error)
    return mockSeasons
  }
}

export async function getDriverStandings(season: string): Promise<DriverStanding[]> {
  try {
    const data = await fetchErgast<DriverStandingsResponse>(
      `/${season}/driverStandings.json`,
    )

    const standingsList = data.MRData.StandingsTable.StandingsLists?.[0]

    if (!standingsList) {
      return []
    }

    return standingsList.DriverStandings.map((item) => ({
      position: Number(item.position),
      points: Number(item.points),
      wins: Number(item.wins),
      driver: item.Driver,
      constructors: item.Constructors,
    }))
  } catch (error) {
    console.warn('Ergast driver standings fetch failed, using mock data', error)
    return mockDriverStandings
  }
}

export async function getConstructorStandings(
  season: string,
): Promise<ConstructorStanding[]> {
  try {
    const data = await fetchErgast<ConstructorStandingsResponse>(
      `/${season}/constructorStandings.json`,
    )

    const standingsList = data.MRData.StandingsTable.StandingsLists?.[0]

    if (!standingsList) {
      return []
    }

    return standingsList.ConstructorStandings.map((item) => ({
      position: Number(item.position),
      points: Number(item.points),
      wins: Number(item.wins),
      constructor: item.Constructor,
    }))
  } catch (error) {
    console.warn('Ergast constructor standings fetch failed, using mock data', error)
    return mockConstructorStandings
  }
}

export async function getRaceSchedule(season: string): Promise<RaceSummary[]> {
  try {
    const data = await fetchErgast<RaceScheduleResponse>(`/${season}.json?limit=60`)

    return (
      data.MRData.RaceTable.Races?.map((race) => ({
        round: Number(race.round),
        raceName: race.raceName,
        date: race.date,
        time: race.time,
        circuitId: race.Circuit.circuitId,
        circuitName: race.Circuit.circuitName,
        locality: race.Circuit.Location.locality,
        country: race.Circuit.Location.country,
      })) ?? []
    )
  } catch (error) {
    console.warn('Ergast schedule fetch failed, using mock data', error)
    return mockSchedule
  }
}

export async function getDriverResults(
  season: string,
  driverId: string,
): Promise<DriverRaceResult[]> {
  try {
    const data = await fetchErgast<DriverResultsResponse>(
      `/${season}/drivers/${driverId}/results.json?limit=100`,
    )

    return (
      data.MRData.RaceTable.Races?.map((race) => {
        const result = race.Results?.[0]
        if (!result) {
          return undefined
        }

        return {
          round: Number(race.round),
          raceName: race.raceName,
          points: Number(result.points),
          position: Number(result.position),
          grid: Number(result.grid),
          status: result.status,
        } satisfies DriverRaceResult
      }).filter(Boolean) as DriverRaceResult[]
    )
  } catch (error) {
    console.warn(`Ergast results fetch failed for ${driverId}, using mock data`, error)
    return getMockResults(driverId)
  }
}

export async function getDrivers(season: string): Promise<Driver[]> {
  try {
    const data = await fetchErgast<DriversResponse>(
      `/${season}/drivers.json?limit=100`,
    )
    return data.MRData.DriverTable.Drivers ?? []
  } catch (error) {
    console.warn('Ergast drivers fetch failed, using mock data', error)
    return mockDrivers
  }
}

