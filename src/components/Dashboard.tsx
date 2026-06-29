import { useEffect, useState } from 'react'
import type { CityWeatherState } from '../types'
import { CITIES } from '../data/cities'
import { fetchCityWeather } from '../lib/fetchWeather'
import { isWolleMode, wolleWeatherState } from '../lib/wolleMode'
import { CityCard } from './CityCard'
import './Dashboard.css'

type WeatherByCity = Record<string, CityWeatherState>

const INITIAL_STATE: WeatherByCity = Object.fromEntries(
  CITIES.map((city) => [city.name, { status: 'loading' } as CityWeatherState]),
)

export function Dashboard() {
  const [weather, setWeather] = useState<WeatherByCity>(INITIAL_STATE)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [name, setName] = useState('')

  const wolle = isWolleMode(name)

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
      </header>

      <main className="dashboard__grid">
        {CITIES.map((city, i) => (
          <CityCard
            key={city.name}
            city={city}
            state={wolle ? wolleWeatherState(i) : weather[city.name]}
          />
        ))}
      </main>
    </div>
  )
}
