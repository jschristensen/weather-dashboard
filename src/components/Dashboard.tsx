import { useEffect, useState } from 'react'
import type { CityWeatherState } from '../types'
import { CITIES } from '../data/cities'
import { fetchCityWeather } from '../lib/fetchWeather'
import { isWolleMode, wolleWeatherState } from '../lib/wolleMode'
import { isUffeMode, VOEL } from '../lib/uffeMode'
import { CityCard } from './CityCard'
import './Dashboard.css'

type WeatherByCity = Record<string, CityWeatherState>

const INITIAL_STATE: WeatherByCity = Object.fromEntries(
  CITIES.map((city) => [city.name, { status: 'loading' } as CityWeatherState]),
)

export function Dashboard() {
  const [weather, setWeather] = useState<WeatherByCity>(INITIAL_STATE)
  const [voel, setVoel] = useState<CityWeatherState>({ status: 'loading' })
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [name, setName] = useState('')

  const wolle = isWolleMode(name)
  const uffe = isUffeMode(name)

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

    // Also fetch Voel's real weather for the "Uffe" easter egg.
    fetchCityWeather(VOEL)
      .then((data) => {
        if (cancelled) return
        setVoel({ status: 'success', weather: data })
      })
      .catch(() => {
        if (cancelled) return
        setVoel({ status: 'error' })
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

        {uffe && (
          <p className="dashboard__hint">🇩🇰 Uffe mode: it's Voel weather everywhere</p>
        )}
      </header>

      <main className="dashboard__grid">
        {CITIES.map((city, i) => {
          const state = uffe
            ? voel
            : wolle
              ? wolleWeatherState(i)
              : weather[city.name]
          return <CityCard key={city.name} city={city} state={state} />
        })}
      </main>
    </div>
  )
}
