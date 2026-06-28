import { useState, useEffect } from "react";

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  condition: string;
  icon: string;
}

const WMO_MAP: Record<number, { condition: string; icon: string }> = {
  0:  { condition: "Clear Sky",      icon: "☀️" },
  1:  { condition: "Mainly Clear",   icon: "🌤️" },
  2:  { condition: "Partly Cloudy",  icon: "⛅" },
  3:  { condition: "Overcast",       icon: "☁️" },
  45: { condition: "Foggy",          icon: "🌫️" },
  48: { condition: "Icy Fog",        icon: "🌫️" },
  51: { condition: "Light Drizzle",  icon: "🌦️" },
  53: { condition: "Drizzle",        icon: "🌦️" },
  55: { condition: "Heavy Drizzle",  icon: "🌦️" },
  61: { condition: "Light Rain",     icon: "🌧️" },
  63: { condition: "Rain",           icon: "🌧️" },
  65: { condition: "Heavy Rain",     icon: "🌧️" },
  80: { condition: "Rain Showers",   icon: "🌦️" },
  81: { condition: "Showers",        icon: "🌦️" },
  82: { condition: "Heavy Showers",  icon: "⛈️" },
  95: { condition: "Thunderstorm",   icon: "⛈️" },
  96: { condition: "Thunderstorm",   icon: "⛈️" },
  99: { condition: "Thunderstorm",   icon: "⛈️" },
};

export function useWeather(): WeatherData | null {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=-29.8587&longitude=31.0218" +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
      "&timezone=Africa%2FJohannesburg"
    )
      .then(r => r.json())
      .then(data => {
        const cur = data.current;
        const code = cur.weather_code as number;
        const mapped = WMO_MAP[code] ?? { condition: "Partly Cloudy", icon: "⛅" };
        setWeather({
          temperature: Math.round(cur.temperature_2m),
          windSpeed: Math.round(cur.wind_speed_10m),
          humidity: Math.round(cur.relative_humidity_2m),
          ...mapped,
        });
      })
      .catch(() => {});
  }, []);

  return weather;
}
