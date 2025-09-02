import MapView from "./MapView";
import MapTitle from "./MapTitle";
import MapHeader from "./MapHeader";
import type { FloorMap } from "../../types/floorMap";
import type { Room } from "../../types/room";
import { useMaps } from "../../hooks/useMap";
import { useEffect, useState } from "react";

interface Building {
  id: number;
  name: string;
}

interface MapContainerProps {
  buildings: Building[];
  selectedBuildingId: number | null;
  onBuildingChange: (id: number) => void;
  selectedBuildingFloors: FloorMap[];
  selectedFloorId: number | null;
  onFloorChange: (id: number) => void;
  date: string;
  onDateChange: (date: string) => void;
  selectedFloor: FloorMap | undefined;
  selectedRooms: Room[];
  loading: boolean;
  error: string | null;
}

function MapContainer({
  buildings,
  selectedBuildingId,
  onBuildingChange,
  selectedBuildingFloors,
  selectedFloorId,
  onFloorChange,
  date,
  onDateChange,
  selectedFloor,
  selectedRooms,
  loading,
  error,
}: MapContainerProps) {
  if (loading) return <div>Chargement des plans...</div>;
  if (error) return <div>{error}</div>;
  if (!selectedFloor) return <div>Aucun plan trouvé</div>;
  const { fetchMapImage } = useMaps();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFloor?.id) {
      fetchMapImage(selectedFloor.id).then((url) => {
        if (url) setImageUrl(url);
      });
    }
  }, [selectedFloor, fetchMapImage]);

  return (
    <>
      <MapHeader
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={onBuildingChange}
        selectedBuildingFloors={selectedBuildingFloors}
        selectedFloorId={selectedFloorId}
        onFloorChange={onFloorChange}
        date={date}
        onDateChange={onDateChange}
      />

      <MapTitle
        buildingName={`Building ${selectedBuildingId}`}
        floorName={selectedFloor.file_name}
      />

      <div className="p-2.5 relative">
        <MapView
          image={imageUrl ?? ""}
          bounds={[
            [0, 0],
            [selectedFloor.length, selectedFloor.width],
          ]}
          rooms={selectedRooms}
        />
      </div>
    </>
  );
}

export default MapContainer;
