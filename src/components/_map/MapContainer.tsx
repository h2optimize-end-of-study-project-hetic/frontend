import MapView from "./MapView";
import MapTitle from "./MapTitle";
import MapHeader from "./MapHeader";
import type { FloorMap } from "../../types/floorMap";
import type { Room } from "../../types/room";
import { useMaps } from "../../hooks/useMap";
import { useEffect } from "react";
import type { EventsByDate } from "../../types/eventsByDate";
import { useLocation } from "react-router-dom";
import { EventContent } from "../organisms/event/EventContent";

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
  eventsByDate: EventsByDate[] | null;
  setEventsByDate: React.Dispatch<React.SetStateAction<EventsByDate[] | null>>;
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
  eventsByDate,
  setEventsByDate,
  loading,
  error,
}: MapContainerProps) {
  if (loading) return <div>Chargement des plans...</div>;
  if (error) return <div>{error}</div>;
  if (!selectedFloor) return <div>Aucun plan trouvé</div>;

  const { imageUrl, loadFloorImage } = useMaps();

  useEffect(() => {
    if (selectedFloor?.id) {
      loadFloorImage(selectedFloor.id);
    }
  }, [selectedFloor]);

  const selectedBuild = buildings.find((b) => b.id === selectedBuildingId);
  const location = useLocation();

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
        buildingName={`${selectedBuild?.name}`}
        floorName={selectedFloor.file_name}
      />

      <div className="p-2.5 relative flex flex-row gap-2.5">
        {imageUrl && selectedFloor && selectedRooms && eventsByDate && (
          <MapView
            image={imageUrl}
            bounds={[
              [0, 0],
              [selectedFloor.length, selectedFloor.width],
            ]}
            rooms={selectedRooms}
            events={eventsByDate}
          />
        )}
        {location.pathname === "/edit" && (
          <EventContent
            eventsByDate={eventsByDate}
            setEventsByDate={setEventsByDate}
            selectedRooms={selectedRooms}
            selectedFloorId={selectedFloorId}
            selectedBuildingId={selectedBuildingId}
          />
        )}
      </div>
    </>
  );
}

export default MapContainer;
