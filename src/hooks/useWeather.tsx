import { useEffect, useState } from "react";
import { useAuthHeaders } from "../hooks/useAuthHeader";
import { getCountryISO } from "../utils/country";

export interface Weather {
  city: string;
  temp: number;
  description: string;
}

export function useWeathers(city: string | null, country: string | null) {
  const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headers = useAuthHeaders();

  useEffect(() => {
    if (!city || !country) {
      setLoading(false);
      return;
    }

    const iso = getCountryISO(country);

    const fetchWeathers = async () => {
      try {
        const res = await fetch(
          `${backendURLAPI}/api/v1/weather/current?city=${city}&country=${iso}&units=metric&lang=fr`,
          { headers }
        );

        if (!res.ok) {
          if (res.status === 404) {
            setWeather(null);
            return;
          }
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        setWeather({
          city: json.name,
          temp: json.main?.temp,
          description: json.weather?.[0]?.description ?? "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeathers();
  }, [backendURLAPI, headers, city, country]);

  return { weather, loading, error };
}
