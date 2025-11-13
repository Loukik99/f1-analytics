import { useQuery } from '@tanstack/react-query'
import {
  getAvailableSeasons,
  getConstructorStandings,
  getDriverResults,
  getDriverStandings,
  getDrivers,
  getRaceSchedule,
} from '../services/ergast'

export function useAvailableSeasons() {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: () => getAvailableSeasons(60),
  })
}

export function useDriverStandings(season: string) {
  return useQuery({
    queryKey: ['driver-standings', season],
    queryFn: () => getDriverStandings(season),
    enabled: Boolean(season),
  })
}

export function useConstructorStandings(season: string) {
  return useQuery({
    queryKey: ['constructor-standings', season],
    queryFn: () => getConstructorStandings(season),
    enabled: Boolean(season),
  })
}

export function useRaceSchedule(season: string) {
  return useQuery({
    queryKey: ['race-schedule', season],
    queryFn: () => getRaceSchedule(season),
    enabled: Boolean(season),
  })
}

export function useDrivers(season: string) {
  return useQuery({
    queryKey: ['drivers', season],
    queryFn: () => getDrivers(season),
    enabled: Boolean(season),
  })
}

export function useDriverResults(
  season: string,
  driverId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ['driver-results', season, driverId],
    queryFn: () => getDriverResults(season, driverId!),
    enabled: Boolean(season && driverId && enabled),
  })
}

