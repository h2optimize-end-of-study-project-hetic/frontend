import { useState } from "react";
import { useAuthHeaders } from "./useAuthHeader";

export default function GeoForecast() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const headers = useAuthHeaders();
  

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/weather/current/by-coords?lat=45&lon=100&units=metric&lang=fr`,
        { headers }
      );
      if (res.status === 404) return;

      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

      const data = await res.json();
      console.log(data)

    } catch (err) {
      console.error("Erreur dans fetchTag:", err);
    }
  };


  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée.");
    }
  };


  return (
    <div>
      <button onClick={getLocation}>Obtenir ma position</button>
      {coords && (
        <p>
          Latitude: {coords.lat}, Longitude: {coords.lon}
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
