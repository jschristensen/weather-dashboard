# Spec: European Capitals Weather Dashboard

## 1. Overview

A single-page dashboard that displays the **current weather** in the 10 most populous
European capital cities. The dashboard fetches live data when the page loads and renders
one card per city.

**Goal:** At a glance, a user can compare current conditions across Europe's biggest
capitals on one screen.

## 2. Decisions (locked)

| Area | Choice | Notes |
|------|--------|-------|
| Tech stack | **React + Vite + TypeScript** | SPA, modern build tooling, room to grow |
| Data source | **Open-Meteo** | Free, no API key, generous rate limits |
| Data shown | **Core conditions** | Temperature, condition, weather icon |
| Refresh | **On page load only** | One fetch per load; no polling/buttons (v1) |
| Styling | **Plain CSS** | CSS / CSS modules; no utility framework |
| City list | **Minsk** at #8 | Kept over Bucharest |

## 3. Cities in scope

The 10 most populous European capitals (by city-proper population). Coordinates are
included because Open-Meteo is queried by latitude/longitude.

| # | City | Country | Latitude | Longitude |
|---|------|---------|----------|-----------|
| 1 | Moscow | Russia | 55.7558 | 37.6173 |
| 2 | London | United Kingdom | 51.5074 | -0.1278 |
| 3 | Berlin | Germany | 52.5200 | 13.4050 |
| 4 | Madrid | Spain | 40.4168 | -3.7038 |
| 5 | Kyiv | Ukraine | 50.4501 | 30.5234 |
| 6 | Rome | Italy | 41.9028 | 12.4964 |
| 7 | Paris | France | 48.8566 | 2.3522 |
| 8 | Minsk | Belarus | 53.9006 | 27.5590 |
| 9 | Vienna | Austria | 48.2082 | 16.3738 |
| 10 | Warsaw | Poland | 52.2297 | 21.0122 |

> The city list is a **static constant** in the codebase (no geocoding API). If the
> definition of "biggest" is contested, it's a one-line edit. Bucharest (~1.8M) is the
> closest runner-up but Minsk is kept at #8.

## 4. Data source details

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

**Query parameters per city:**
- `latitude`, `longitude` — from the table above
- `current=temperature_2m,weather_code`
- `temperature_unit=celsius`
- `timezone=auto`

**Example request:**
```
https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto
```

**Relevant response fields:**
```json
{
  "current": {
    "time": "2026-06-29T14:00",
    "temperature_2m": 18.4,
    "weather_code": 3
  }
}
```

**Fetching strategy:** Issue all 10 requests in parallel (`Promise.allSettled`) so one
slow/failed city does not block the others. Each city resolves or fails independently.

### WMO weather code mapping

Open-Meteo returns a numeric [WMO weather code](https://open-meteo.com/en/docs). Map it to
a human label + icon:

| Codes | Condition | Icon |
|-------|-----------|------|
| 0 | Clear sky | ☀️ |
| 1, 2, 3 | Partly cloudy | ⛅ |
| 45, 48 | Fog | 🌫️ |
| 51, 53, 55, 56, 57 | Drizzle | 🌦️ |
| 61, 63, 65, 66, 67 | Rain | 🌧️ |
| 71, 73, 75, 77 | Snow | ❄️ |
| 80, 81, 82 | Rain showers | 🌦️ |
| 85, 86 | Snow showers | 🌨️ |
| 95, 96, 99 | Thunderstorm | ⛈️ |

Unknown codes fall back to a neutral label ("—") and a default icon (🌡️).

## 5. UI / layout

- **Header:** Title ("European Capitals — Current Weather") and a subtle "last updated"
  timestamp (time of the page-load fetch).
- **Grid:** Responsive card grid.
  - Desktop: 3–4 columns
  - Tablet: 2 columns
  - Mobile: 1 column
- **City card** shows:
  - City name + country
  - Weather icon (large)
  - Temperature in °C (prominent)
  - Condition label
- Cards render in the fixed order of the table above (rank by population).

### Card states

| State | Appearance |
|-------|------------|
| Loading | Skeleton/placeholder card (shown while the fetch is in flight) |
| Success | Icon, temperature, condition label |
| Error | Card shows city name + "Unavailable" message; other cards unaffected |

## 6. Behavior

- On mount, fire all 10 fetches. Show loading skeletons until each resolves.
- No auto-refresh, no manual refresh button in v1. Refreshing the browser re-fetches.
- All data is client-side; no backend, no persistence.

## 7. Non-goals (v1)

- Forecasts (multi-day or hourly)
- Feels-like, humidity, wind, min/max (deliberately excluded — "core conditions" only)
- City search / user-configurable city list
- Unit toggle (°C/°F) — fixed to Celsius
- Auto-refresh or manual refresh controls
- Authentication, backend, or data storage
- Internationalization

## 8. Tech / structure

- **Build:** Vite + React + **TypeScript**
- **State:** Local component state (`useState`/`useEffect`); no external state library
- **HTTP:** Native `fetch`
- **Styling:** Plain CSS / CSS modules

Suggested module layout:
```
src/
  data/cities.ts        # static list of 10 capitals + coordinates
  lib/weatherCodes.ts   # WMO code -> { label, icon }
  lib/fetchWeather.ts   # builds URL, fetches, normalizes response
  types.ts              # City, CurrentWeather, CityWeatherState types
  components/
    Dashboard.tsx       # orchestrates fetches, holds state, renders grid
    CityCard.tsx        # presentational card (loading/success/error)
  App.tsx
  main.tsx
```

## 9. Acceptance criteria

1. Loading the page triggers exactly one fetch per city (10 total).
2. All 10 cities appear as cards in population-rank order.
3. Each successful card shows city name, country, temperature (°C), a condition label,
   and a matching icon.
4. A single failing city renders an error card without breaking the other 9.
5. The grid is responsive (1 / 2 / 3–4 columns across mobile / tablet / desktop).
6. No API key is required to run the app.

## 10. Resolved decisions

- **TypeScript** (not JavaScript).
- **Minsk** kept at #8 (not swapped for Bucharest).
- **Plain CSS** (no utility framework).
