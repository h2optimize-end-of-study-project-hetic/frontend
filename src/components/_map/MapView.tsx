import {
  MapContainer,
  ImageOverlay,
  Polygon,
  Popup,
  Tooltip,
  Marker,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Room } from "../../types/room";
import type { EventsByDate } from "../../types/eventsByDate";
import { formatEventTime } from "../../utils/date";
import { useRef } from "react";

type Props = {
  image: string;
  bounds: [[number, number], [number, number]];
  rooms: Room[];
  events: EventsByDate[] | null;
};

function getPolygonCentroid(points: [number, number][]): [number, number] {
  let x = 0,
    y = 0;
  points.forEach(([px, py]) => {
    x += px;
    y += py;
  });
  return [x / points.length, y / points.length];
}

const MapView = ({ image, bounds, rooms, events }: Props) => {
  const invisibleIcon = L.divIcon({
    className: "invisible-marker",
    iconSize: [0, 0],
  });
  const markerRefs = useRef<Record<number, L.Marker | null>>({});
  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      maxZoom={-1}
      minZoom={-3}
      scrollWheelZoom
      style={{
        height: "70vh",
        width: "100%",
        margin: "auto",
        border: "1px solid var(--light-blue)",
      }}
    >
      <ImageOverlay url={image} bounds={bounds} />

      {rooms.map((room) => {
        const roomEvents =
          events?.filter((event) => event.room_id === room.id) || [];
        const center = getPolygonCentroid(room.shape);
        // const markerRef = useRef<L.Marker>(null);
        if (!markerRefs.current[room.id]) {
          markerRefs.current[room.id] = null;
        }
        return (
          <Polygon
            key={room.id}
            positions={room.shape}
            pathOptions={{
              color:
                roomEvents.length > 0 ? "var(--dark-red)" : "var(--dark-green)",
              fillColor:
                roomEvents.length > 0
                  ? "var(--light-red)"
                  : "var(--light-green)",
              fillOpacity: 1,
              weight: 1,
            }}
            eventHandlers={{
              click: () => {
                markerRefs.current[room.id]?.openPopup();
              },
            }}
          >
            <Tooltip permanent direction="center" opacity={0.8}>
              <strong>{room.name}</strong>
            </Tooltip>
            <Marker
              ref={(el) => {
                markerRefs.current[room.id] = el;
              }}
              position={center}
              icon={invisibleIcon}
              keyboard={true}
              eventHandlers={{
                add: (e) => {
                  const el = e.target.getElement();
                  if (!el) return;

                  el.setAttribute("tabindex", "0");
                  el.addEventListener("focus", () => e.target.openPopup());
                  el.addEventListener("blur", () => e.target.closePopup());

                  el.addEventListener("keydown", (ev: any) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      e.target.openPopup();
                    }
                  });
                },
              }}
            >
              <Popup>
                <div>
                  <strong className="font-bold">{room.name}</strong>
                  <br />
                  <span className="font-semibold">{room.description}</span>
                  <br />
                  Capacité : <strong>{room.capacity}</strong>
                  <br />
                  Occupée : {roomEvents.length > 0 ? "Oui" : "Non"}
                  <br />
                  {/* Température : {room.temperature}°C */}
                  {roomEvents.length > 0 && (
                    <div className="mt-2">
                      <strong>Événements :</strong>
                      <ul className="list-disc pl-4">
                        {roomEvents.map((event, idx) => (
                          <li key={`${event.event_id}-${idx}`}>
                            {formatEventTime(event.start_at, event.end_at)} |{" "}
                            {event.group_name} - {event.event_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          </Polygon>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
