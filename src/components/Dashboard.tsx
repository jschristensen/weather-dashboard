import { useEffect, useState } from 'react'
import type { CityWeatherState } from '../types'
import { CITIES } from '../data/cities'
import { fetchCityWeather } from '../lib/fetchWeather'
import { isWolleMode, wolleWeatherState } from '../lib/wolleMode'
import { matchPlaceMode, PLACE_MODES } from '../lib/placeModes'
import { CityCard } from './CityCard'
import './Dashboard.css'

type WeatherByCity = Record<string, CityWeatherState>

const INITIAL_STATE: WeatherByCity = Object.fromEntries(
  CITIES.map((city) => [city.name, { status: 'loading' } as CityWeatherState]),
)

const INITIAL_PLACE_STATE: WeatherByCity = Object.fromEntries(
  PLACE_MODES.map((m) => [m.place.name, { status: 'loading' } as CityWeatherState]),
)

export function Dashboard() {
  const [weather, setWeather] = useState<WeatherByCity>(INITIAL_STATE)
  const [placeWeather, setPlaceWeather] = useState<WeatherByCity>(INITIAL_PLACE_STATE)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [name, setName] = useState('')

  const wolle = isWolleMode(name)
  const placeMode = matchPlaceMode(name)

  useEffect(() => {
    let cancelled = false

    // Fire all requests in parallel; each city resolves independently.
    CITIES.forEach((city) => {
      fetchCityWeather(city)
        .then((data) => {
          if (cancelled) return
          setWeather((prev) => ({
            ...prev,
            [city.name]: { status: 'success', weather: data },
          }))
        })
        .catch(() => {
          if (cancelled) return
          setWeather((prev) => ({
            ...prev,
            [city.name]: { status: 'error' },
          }))
        })
    })

    // Also fetch each place-mode location's real weather (Uffe→Voel, Jasper→Groningen).
    PLACE_MODES.forEach((mode) => {
      fetchCityWeather(mode.place)
        .then((data) => {
          if (cancelled) return
          setPlaceWeather((prev) => ({
            ...prev,
            [mode.place.name]: { status: 'success', weather: data },
          }))
        })
        .catch(() => {
          if (cancelled) return
          setPlaceWeather((prev) => ({
            ...prev,
            [mode.place.name]: { status: 'error' },
          }))
        })
    })

    setUpdatedAt(new Date())

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">European Capitals — Current Weather</h1>
        {updatedAt && (
          <p className="dashboard__updated">
            Last updated {updatedAt.toLocaleTimeString()}
          </p>
        )}

        <label className="dashboard__name">
          Your name
          <input
            type="text"
            className="dashboard__name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>

        {wolle && (
          <p className="dashboard__hint">☔ Wolle mode: London-autumn vibes everywhere</p>
        )}

        {placeMode && <p className="dashboard__hint">{placeMode.hint}</p>}
      </header>

      <main className="dashboard__grid">
        {CITIES.map((city, i) => {
          const state = placeMode
            ? placeWeather[placeMode.place.name]
            : wolle
              ? wolleWeatherState(i)
              : weather[city.name]
          return <CityCard key={city.name} city={city} state={state} />
        })}
      </main>
    </div>
  )
}
