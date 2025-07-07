import { useEffect, useRef } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";

type Props = {
  image: string;
  bounds: [[number, number], [number, number]];
};

const MapViewWithDraw = ({ image, bounds }: Props) => {
  const map = useMap();
  const drawControlRef = useRef<L.Control.Draw>();

  function formatLatLngList(latlngs: L.LatLng[]): string {
    // Transforme chaque LatLng en tableau [lat, lng] avec arrondi à 2 décimales
    const list = latlngs.map(({ lat, lng }) => [
      Math.round(lat * 100) / 100,
      Math.round(lng * 100) / 100,
    ]);

    // Retourne sous forme de chaîne JSON bien indentée
    return JSON.stringify(list, null, 2);
  }

  useEffect(() => {
    if (!map) return;

    // Initialize the FeatureGroup to store editable layers
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Initialize the draw control and pass it the FeatureGroup of editable layers
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        polyline: false,
        rectangle: true,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    map.addControl(drawControl);
    drawControlRef.current = drawControl;

    // When a new shape is created
    map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      if (layer instanceof L.Polygon) {
        // layer.getLatLngs() renvoie un tableau de tableaux de LatLng
        // On prend le premier anneau (exterieur) du polygone
        const latlngs = layer.getLatLngs()[0] as L.LatLng[];

        // formatLatLngList attend un tableau plat de LatLng
        const formatted = formatLatLngList(latlngs);
        console.log("Coords formatées :\n", formatted);
        alert("Polygone dessiné, regarde la console pour les coords");
      }
    });

    // Cleanup on unmount
    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map]);

  useEffect(() => {
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 1 });
  }, [map, bounds]);

  return <ImageOverlay url={image} bounds={bounds} />;
};

// Wrapper pour MapContainer car useMap ne fonctionne que dans un enfant du MapContainer
const MapWithDrawWrapper = (props: Props) => {
  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={props.bounds}
      style={{ height: "70vh", width: "100%" }}
      zoom={0}
      maxZoom={2}
      minZoom={-3}
      scrollWheelZoom
    >
      <MapViewWithDraw {...props} />
    </MapContainer>
  );
};

export default MapWithDrawWrapper;
