import { useAtom } from "jotai";
import { locationAtom } from "../components/atoms/locationAtom";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";

import MapContainer from "../components/_map/MapContainer";
import { useMaps } from "../hooks/useMap";
import { useRooms } from "../hooks/useRoom";
import { formatDateForInput } from "../utils/date";
import { useBuildings } from "../hooks/useBuilding";
import { useEventsByDate } from "../hooks/useEvents";

const Dashboard = () => {
  const navigate = useNavigate();

  const { maps, loading, error } = useMaps();
  const { rooms, loadingRoom, errorRoom } = useRooms();

  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null
  );
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [date, setDate] = useState(() => formatDateForInput(new Date()));
  const { eventsByDate, eventsLoading, eventsError, setEventsByDate } =
    useEventsByDate(date);
  const { buildings, buildLoading, buildError } = useBuildings();

  // Étages du bâtiment sélectionné
  const selectedBuildingFloors = maps.filter(
    (m) => m.building_id === selectedBuildingId
  );

  const selectedFloor = selectedBuildingFloors.find(
    (m) => m.id === selectedFloorId
  );

  const selectedRooms = selectedFloor
    ? rooms.filter(
        (room) =>
          room.building_id === selectedBuildingId &&
          room.floor === selectedFloor.floor
      )
    : [];

  // Init : choisir la date et le premier building/floor
  useEffect(() => {
    if (maps.length > 0 && selectedBuildingId === null) {
      const firstBuildingId = maps[0].building_id;
      setSelectedBuildingId(firstBuildingId);

      const firstFloor = maps.find((m) => m.building_id === firstBuildingId);
      if (firstFloor) setSelectedFloorId(firstFloor.id);
    }
  }, [maps, selectedBuildingId]);

  // Changement de bâtiment
  const onBuildingChange = (id: number) => {
    setSelectedBuildingId(id);
    const firstFloor = maps.find((m) => m.building_id === id);
    if (firstFloor) setSelectedFloorId(firstFloor.id);
  };

  const [, setLocation] = useAtom(locationAtom);

  useEffect(() => {
    const currentBuilding = buildings.find((b) => b.id === selectedBuildingId);
    if (!currentBuilding) return;

    const locationData = {
      city: currentBuilding.city,
      country: currentBuilding.country,
    };
    localStorage.setItem("selectedLocation", JSON.stringify(locationData));
    setLocation(locationData);
  }, [selectedBuildingId, buildings, setLocation]);

  return (
    <div>
      <div className="!my-4">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--light-green)",
            color: "var(--dark-green)",
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
          onClick={() => navigate("/edit")}
        >
          Éditer le planning
        </Button>
      </div>

      <MapContainer
        buildings={buildings ?? []}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={onBuildingChange}
        selectedBuildingFloors={selectedBuildingFloors ?? []}
        selectedFloorId={selectedFloorId}
        onFloorChange={(id) => setSelectedFloorId(id)}
        date={date}
        onDateChange={setDate}
        selectedFloor={selectedFloor ?? undefined}
        selectedRooms={selectedRooms ?? []}
        eventsByDate={eventsByDate ?? []}
        loading={loading || loadingRoom || eventsLoading || buildLoading}
        error={error || errorRoom || eventsError || buildError}
        setEventsByDate={setEventsByDate}
      />
    </div>
  );
};

export default Dashboard;
