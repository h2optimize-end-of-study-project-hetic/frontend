import { useEffect, useState } from "react";
import type { Map } from "../types/map";

export function useMaps() {
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/map");
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        setMaps(json.data ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  // helper pour récupérer l’URL d’une image
  const getMapImageUrl = (id: number) =>
    `http://localhost:8000/api/v1/map/img/${id}`;

  return { maps, loading, error, getMapImageUrl };
}
