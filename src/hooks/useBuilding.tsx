import { useEffect, useState } from "react";
import type { Building } from "../types/building";
import { useAuthHeaders } from "../hooks/useAuthHeader";

export function useBuildings() {
  const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [buildLoading, setLoading] = useState(true);
  const [buildError, setError] = useState<string | null>(null);
  const headers = useAuthHeaders();

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch(`${backendURLAPI}/api/v1/building`, {
          headers,
        });

        if (res.status === 404) return;
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        setBuildings(json.data ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [backendURLAPI, headers]);

  return { buildings, buildLoading, buildError };
}
