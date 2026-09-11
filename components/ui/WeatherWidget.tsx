'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudLightning, Snowflake, Zap } from 'lucide-react'

interface WeatherData {
  temperature: number
  weatherCode: number
  isDay: boolean
  conditionText: string
  isRaining: boolean
  isThunder: boolean
  isDrizzle: boolean
  isSnowing: boolean
  isCloudy: boolean
  isFoggy: boolean
}

function getWeatherInfo(code: number, isDay: boolean): Omit<WeatherData, 'temperature' | 'weatherCode' | 'isDay'> {
  if (code === 0)  return { conditionText: isDay ? 'Despejado' : 'Noche clara',    isRaining: false, isThunder: false, isDrizzle: false, isSnowing: false, isCloudy: false, isFoggy: false }
  if (code === 1)  return { conditionText: isDay ? 'Mayormente despejado' : 'Cielo claro', isRaining: false, isThunder: false, isDrizzle: false, isSnowing: false, isCloudy: false, isFoggy: false }
  if (code === 2)  return { conditionText: 'Parcialmente nublado',                 isRaining: false, isThunder: false, isDrizzle: false, isSnowing: false, isCloudy: true,  isFoggy: false }
  if (code === 3)  return { conditionText: 'Nublado',                               isRaining: false, isThunder: false, isDrizzle: false, isSnowing: false, isCloudy: true,  isFoggy: false }
  if (code === 45 || code === 48) return { conditionText: 'Niebla',                isRaining: false, isThunder: false, isDrizzle: false, isSnowing: false, isCloudy: true,  isFoggy: true  }
  if (code >= 51 && code <= 57)   return { conditionText: 'Llovizna',              isRaining: false, isThunder: false, isDrizzle: true,  isSnowing: false, isCloudy: true,  isFoggy: false }
  if (code >= 61 && code <= 67)   return { conditionText: 'Lluvia',                isRaining: true,  isThunder: false, isDrizzle: false, isSnowing: false, isCloudy: true,  isFoggy: false }
  if (code >= 71 && code <= 77)   return { conditionText: 'Nevada',                isRaining: false, isThunder: false, isDrizzle: false, isSnowing: true,  isCloudy: true,  isFoggy: false }
  if (code >= 80 && code <= 82)   return { conditionText: 'Chubascos',             isRaining: true,  isThunder: false, isDrizzle: false, isSnowing: false, isCloudy: true,  isFoggy: false }
  if (code >= 95)                 return { conditionText: 'Tormenta eléctrica',    isRaining: true,  isThunder: true,  isDrizzle: false, isSnowing: false, isCloudy: true,  isFoggy: false }
  return                                 { conditionText: 'Templado',               isRaining: false, isThunder: false, isDrizzle: false, isSnowing: false, isCloudy: false, isFoggy: false }
}

// Drops config: [left%, delay-ms]
const DROPS: [number, number][] = [
  [12, 0], [28, 180], [44, 80], [60, 280], [76, 140],
  [20, 320], [52, 40], [68, 220], [36, 380], [84, 100],
]

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=20.5218&longitude=-99.8936&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m&timezone=America%2FMexico_City'
        )
        if (!res.ok) throw new Error()
        const data = await res.json()
        const c = data.current
        if (!mounted || !c) return

        const code: number = c.weather_code ?? 2
        const isDay: boolean = c.is_day === 1
        const rainMm: number = c.rain ?? c.precipitation ?? 0
        const info = getWeatherInfo(code, isDay)

        setWeather({
          temperature: Math.round(c.temperature_2m ?? 17),
          weatherCode: code,
          isDay,
          ...info,
          isRaining: info.isRaining || rainMm > 0,
          isThunder: info.isThunder || code >= 95,
        })
      } catch {
        // mantener estado previo si falla
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchWeather()
    const id = setInterval(fetchWeather, 600_000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white/60 h-9.5">
        <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-sky-400 animate-spin" />
        <span className="text-xs text-slate-400 hidden lg:inline">Clima…</span>
      </div>
    )
  }

  const code      = weather?.weatherCode ?? 2
  const isDay     = weather?.isDay      ?? true
  const isRaining = weather?.isRaining  ?? false
  const isThunder = weather?.isThunder  ?? false
  const isDrizzle = weather?.isDrizzle  ?? false
  const isSnowing = weather?.isSnowing  ?? false
  const isCloudy  = weather?.isCloudy   ?? false
  const isFoggy   = weather?.isFoggy    ?? false
  const isSunny   = code === 0 && isDay

  const wetWeather = isRaining || isThunder || isDrizzle

  // ── Estilos según condición ──────────────────────────────────────────────
  let widgetBg   = 'bg-gradient-to-br from-sky-100 to-blue-50 border-sky-200'
  let tempColor  = 'text-slate-800'
  let labelColor = 'text-slate-500'
  let cityColor  = 'text-slate-400'

  if (isThunder) {
    widgetBg   = 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-700/50'
    tempColor  = 'text-white'
    labelColor = 'text-indigo-300'
    cityColor  = 'text-indigo-400/70'
  } else if (isRaining || isDrizzle) {
    widgetBg   = 'bg-gradient-to-br from-slate-800 via-sky-900 to-slate-900 border-sky-600/50'
    tempColor  = 'text-white'
    labelColor = 'text-sky-300'
    cityColor  = 'text-sky-400/70'
  } else if (isSnowing) {
    widgetBg   = 'bg-gradient-to-br from-blue-50 to-slate-100 border-blue-200'
    tempColor  = 'text-slate-700'
    labelColor = 'text-blue-400'
    cityColor  = 'text-blue-300'
  } else if (isSunny) {
    widgetBg   = 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
    tempColor  = 'text-amber-900'
    labelColor = 'text-amber-500'
    cityColor  = 'text-amber-400'
  } else if (isFoggy) {
    widgetBg   = 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300'
  }

  return (
    <div
      className={`relative overflow-hidden flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-700 shadow-sm select-none ${widgetBg}`}
      style={{ minWidth: 120 }}
    >
      {/* ── Fondo ambiental de relámpago ── */}
      {isThunder && (
        <div className="absolute inset-0 pointer-events-none animate-lightning-flash-bg rounded-xl z-0" />
      )}

      {/* ── Partículas de lluvia (overlay completo en el widget) ── */}
      {wetWeather && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
          {DROPS.map(([left, delay], i) => (
            <span
              key={i}
              className={`absolute top-0 rounded-full ${isThunder ? 'bg-indigo-300/70' : 'bg-sky-400/80'}`}
              style={{
                left: `${left}%`,
                width: 1.5,
                height: isDrizzle ? 6 : 10,
                animation: `rain-fall ${isDrizzle ? '1.1s' : '0.7s'} linear infinite`,
                animationDelay: `${delay}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Copos de nieve ── */}
      {isSnowing && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
          {[10, 35, 60, 80].map((left, i) => (
            <span
              key={i}
              className="absolute top-0 text-[9px] text-blue-300"
              style={{
                left: `${left}%`,
                animation: `rain-fall 1.4s linear infinite`,
                animationDelay: `${i * 280}ms`,
              }}
            >
              ❄
            </span>
          ))}
        </div>
      )}

      {/* ── Icono animado según condición real ── */}
      <div className="relative z-20 w-8 h-8 flex items-center justify-center shrink-0">

        {/* Brillo pulsante detrás del sol */}
        {isSunny && (
          <div className="absolute inset-0 rounded-full bg-amber-300/25 animate-pulse scale-[1.8] blur-sm" />
        )}

        {/* Rayo que destella en tormenta */}
        {isThunder && (
          <div className="absolute -top-1 -right-0.5 animate-lightning-bolt z-30">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,1)]" />
          </div>
        )}

        {isThunder                                                               && <CloudLightning className="w-6 h-6 animate-thunder-icon text-yellow-300" />}
        {!isThunder && (isRaining || isDrizzle)                                  && <CloudRain      className="w-6 h-6 animate-rain-icon text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]" />}
        {!wetWeather && isSnowing                                                && <Snowflake      className="w-6 h-6 animate-snow-drift text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.6)]" />}
        {!wetWeather && !isSnowing && isFoggy                                    && <Cloud          className="w-6 h-6 animate-fog-pulse text-slate-400" />}
        {!wetWeather && !isSnowing && !isFoggy && isCloudy && code === 2 && isDay  && <CloudSun   className="w-6 h-6 animate-cloud-sway text-amber-400" />}
        {!wetWeather && !isSnowing && !isFoggy && isCloudy && code === 2 && !isDay && <CloudMoon  className="w-6 h-6 animate-cloud-drift text-slate-300" />}
        {!wetWeather && !isSnowing && !isFoggy && isCloudy && code === 3          && <Cloud       className="w-6 h-6 animate-cloud-sway text-slate-400" />}
        {!wetWeather && !isSnowing && !isFoggy && !isCloudy && isDay              && <Sun         className="w-6 h-6 animate-sun-breathe text-amber-500" />}
        {!wetWeather && !isSnowing && !isFoggy && !isCloudy && !isDay             && <Moon        className="w-6 h-6 animate-moon-float text-indigo-300" />}
      </div>

      {/* ── Temperatura + condición ── */}
      <div className="relative z-20 flex flex-col leading-tight">
        <div className="flex items-baseline gap-1">
          <span className={`font-bold text-sm ${tempColor} transition-colors duration-500`}>
            {weather?.temperature ?? '--'}°C
          </span>
          <span className={`text-[11px] font-medium hidden lg:inline truncate max-w-24 ${labelColor} transition-colors duration-500`}>
            {weather?.conditionText}
          </span>
        </div>
        <span className={`text-[10px] ${cityColor} transition-colors duration-500`}>
          Tequisquiapan
        </span>
      </div>

      {/* ── Indicador pulsante si hay lluvia activa ── */}
      {wetWeather && (
        <div className="relative z-20 shrink-0">
          <span className="block w-2 h-2 rounded-full bg-sky-400 animate-ping opacity-80" />
        </div>
      )}
    </div>
  )
}
