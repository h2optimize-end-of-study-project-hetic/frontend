// import { useEffect, useState } from "react";
// import type { FloorMap } from "../types/floorMap";
// import { useAuthHeaders } from "./useAuthHeader";

// export function useMaps() {
//   const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;
//   const [maps, setMaps] = useState<FloorMap[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const headers = useAuthHeaders();

//   useEffect(() => {
//     const fetchMaps = async () => {
//       try {
//         const res = await fetch(`${backendURLAPI}/api/v1/map`, { headers });

//         if (res.status === 404) return;
//         if (!res.ok) {
//           throw new Error(`Error ${res.status}: ${res.statusText}`);
//         }
//         const json = await res.json();
//         setMaps(json.data ?? []);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMaps();
//   }, []);

//   // helper pour récupérer l’URL d’une image
//   const getMapImageUrl = (id: number) =>
//     `${backendURLAPI}/api/v1/map/img/${id}`;
//   return { maps, loading, error, getMapImageUrl };
// }

import { useEffect, useState } from "react";
import type { FloorMap } from "../types/floorMap";
import { useAuthHeaders } from "../hooks/useAuthHeader";

export function useMaps() {
  const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;
  const [maps, setMaps] = useState<FloorMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headers = useAuthHeaders();

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const res = await fetch(`${backendURLAPI}/api/v1/map`, { headers });

        if (res.status === 404) return;
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

  // helper pour récupérer l’URL publique (comme tu faisais avant)
  const getMapImageUrl = (id: number) =>
    `${backendURLAPI}/api/v1/map/img/${id}`;

  // helper pour récupérer l’image en blob (si tu veux l’afficher via objectURL)
  const fetchMapImage = async (id: number): Promise<string | null> => {
    try {
      const res = await fetch(`${backendURLAPI}/api/v1/map/img/${id}`, {
        headers,
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  return { maps, loading, error, getMapImageUrl, fetchMapImage };
}
