import {
  MapContainer,
  ImageOverlay,
  Polygon,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Room } from "./MapData";
import { useEffect } from "react";

type Props = {
  image: string;
  bounds: [[number, number], [number, number]];
  rooms: Room[];
};

const FitBoundsOnLoad = ({
  bounds,
}: {
  bounds: [[number, number], [number, number]];
}) => {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, {
      padding: [20, 20],
      maxZoom: 1,
    });
  }, [map, bounds]);

  return null;
};

const MapView = ({ image, bounds, rooms }: Props) => {
  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      // zoom={0}
      maxZoom={-1}
      minZoom={-3}
      scrollWheelZoom
      style={{
        height: "70vh",
        width: "100%",
        margin: "auto",
        border: "1px solid black",
      }}
    >
      {/* Image du plan */}
      <ImageOverlay url={image} bounds={bounds} />

      {/* Marqueurs pour chaque salle */}
      {rooms.map((room) => (
        <Polygon
          key={room.id}
          positions={room.polygon}
          pathOptions={{
            color: room.occupied ? "var(--dark-red)" : "var(--dark-green)",
            fillColor: room.occupied
              ? "var(--light-red)"
              : "var(--light-green)",
            fillOpacity: 1,
            weight: 1,
          }}
        >
          <Tooltip permanent direction="center" opacity={0.8}>
            <strong>{room.name}</strong>
          </Tooltip>

          <Popup>
            <p>
              Salle : <strong>{room.name}</strong>
              <br />
              Capacité : {room.capacity}
              <br />
              Occupée : {room.occupied ? "Oui" : "Non"}
              <br />
              Température : {room.temperature}°C
            </p>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default MapView;
