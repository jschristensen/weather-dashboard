import type { City } from '../types'

// The 10 most populous European capitals, in population-rank order.
// Coordinates are used to query Open-Meteo (no geocoding API).
export const CITIES: City[] = [
  { name: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173 },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Berlin', country: 'Germany', latitude: 52.52, longitude: 13.405 },
  { name: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038 },
  { name: 'Kyiv', country: 'Ukraine', latitude: 50.4501, longitude: 30.5234 },
  { name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Minsk', country: 'Belarus', latitude: 53.9006, longitude: 27.559 },
  { name: 'Vienna', country: 'Austria', latitude: 48.2082, longitude: 16.3738 },
  { name: 'Warsaw', country: 'Poland', latitude: 52.2297, longitude: 21.0122 },
]
