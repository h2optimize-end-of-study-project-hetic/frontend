import { useEffect, useState } from "react";
import type { Room } from "../types/room";

export function useRooms() {
  const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [errorRoom, setErrorRoom] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const res = await fetch(
          `${backendURLAPI}/api/v1/room?offset=0&limit=20`
        );
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        setRooms(json.data ?? []);
      } catch (err: any) {
        setErrorRoom(err.message);
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchMaps();
  }, []);

  return { rooms, loadingRoom, errorRoom };
}
