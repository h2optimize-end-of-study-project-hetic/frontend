import { useEffect, useState } from "react";
import type { FloorMap } from "../types/floorMap";
import { useAuthHeaders } from "../hooks/useAuthHeader";

export function useMaps() {
  const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;
  const [maps, setMaps] = useState<FloorMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const headers = useAuthHeaders();

  // Récupération des plans
  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const res = await fetch(`${backendURLAPI}/api/v1/map`, { headers });

        if (res.status === 404) {
          setMaps([]);
          return;
        }
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
  }, [backendURLAPI, headers]);

  // Helper pour récupérer l'image d'un plan avec token
  const fetchMapImage = async (id: number): Promise<string | null> => {
    try {
      const res = await fetch(`${backendURLAPI}/api/v1/map/img/${id}`, {
        headers,
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Préchargement automatique pour le plan sélectionné
  const loadFloorImage = (floorId: number) => {
    fetchMapImage(floorId).then((url) => {
      if (url) setImageUrl(url);
    });
  };

  return { maps, loading, error, imageUrl, loadFloorImage };
}
