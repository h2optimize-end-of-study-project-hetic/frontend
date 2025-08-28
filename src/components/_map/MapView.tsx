import {
  MapContainer,
  ImageOverlay,
  Polygon,
  Popup,
  Tooltip,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Room } from "../../types/room";

type Props = {
  image: string;
  bounds: [[number, number], [number, number]];
  rooms: Room[];
};

// const FitBoundsOnLoad = ({
//   bounds,
// }: {
//   bounds: [[number, number], [number, number]];
// }) => {
//   const map = useMap();

//   useEffect(() => {
//     map.fitBounds(bounds, {
//       padding: [20, 20],
//       maxZoom: 1,
//     });
//   }, [map, bounds]);

//   return null;
// };

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
        border: "1px solid var(--light-blue)",
      }}
    >
      {/* Image du plan */}
      <ImageOverlay url={image} bounds={bounds} />

      {/* Marqueurs pour chaque salle */}
      {rooms.map((room) => (
        <Polygon
          key={room.id}
          positions={room.shape}
          // pathOptions={{
          //   color:
          //     room.type === "annex"
          //       ? "var(--dark-blue)"
          //       : room.occupied
          //       ? "var(--dark-red)"
          //       : "var(--dark-green)",
          //   fillColor:
          //     room.type === "annex"
          //       ? "var(--light-blue)"
          //       : room.occupied
          //       ? "var(--light-red)"
          //       : "var(--light-green)",
          //   fillOpacity: 1,
          //   weight: 1,
          // }}
        >
          <Tooltip permanent direction="center" opacity={0.8}>
            <strong>{room.name}</strong>
          </Tooltip>

          <Popup>
            <p>
              <strong className="font-bold">{room.name}</strong>
              <br />
              <span className="font-semibold">{room.description}</span>
              <br />
              Capacité : <strong>{room.capacity}</strong>
              <br />
              {/* Occupée : {room.occupied ? "Oui" : "Non"} */}
              <br />
              {/* Température : {room.temperature}°C */}
            </p>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default MapView;
