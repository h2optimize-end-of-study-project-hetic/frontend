import { useEffect, useState } from "react";
import { useAuthHeaders } from "../hooks/useAuthHeader";
import type { EventsByDate } from "../types/eventsByDate";

export function useEventsByDate(date: string) {
  const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;
  const headers = useAuthHeaders();

  // const [eventsByDate, setEventsByDate] = useState<EventsByDate[]>([]);
  const [eventsByDate, setEventsByDate] = useState<EventsByDate[] | null>([]);

  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventsByDate = async () => {
      try {
        const res = await fetch(`${backendURLAPI}/api/v1/view/events/${date}`, {
          headers,
        });

        if (!res.ok) {
          if (res.status === 404) {
            setEventsByDate([]);
            return;
          }
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        setEventsByDate(json ?? []);
      } catch (err: any) {
        setEventsError(err.message);
        setEventsByDate([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEventsByDate();
  }, [backendURLAPI, headers, date]);

  return { eventsByDate, eventsLoading, eventsError, setEventsByDate };
}

export function useDeleteEventRoom() {
  const headers = useAuthHeaders();

  const deleteEventRoom = async (event_room_id: number) => {
    const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;

    try {
      const res = await fetch(
        `${backendURLAPI}/api/v1/event_room/${event_room_id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { deleteEventRoom };
}
