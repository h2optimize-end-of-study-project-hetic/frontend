import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";

import MapContainer from "../components/_map/MapContainer";
import { useMaps } from "../hooks/useMap";
import { useRooms } from "../hooks/useRoom";
import { formatDateForInput } from "../utils/date";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

const Edit = () => {
  const navigate = useNavigate();

  const { maps, loading, error } = useMaps();
  const { rooms, loadingRoom, errorRoom } = useRooms();

  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null
  );
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");

  // Liste des bâtiments
  const buildings = Array.from(new Set(maps.map((m) => m.building_id))).map(
    (id) => ({ id, name: `Bâtiment ${id}` })
  );

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
    const now = new Date();
    setDate(formatDateForInput(now));

    if (maps.length > 0 && selectedBuildingId === null) {
      const firstBuildingId = maps[0].building_id;
      setSelectedBuildingId(firstBuildingId);

      const firstFloor = maps.find((m) => m.building_id === firstBuildingId);
      if (firstFloor) setSelectedFloorId(firstFloor.id);
    }
  }, [maps]);

  // Changement de bâtiment
  const onBuildingChange = (id: number) => {
    setSelectedBuildingId(id);
    const firstFloor = maps.find((m) => m.building_id === id);
    if (firstFloor) setSelectedFloorId(firstFloor.id);
  };

  return (
    <div>
      <div className="!my-4 flex flex-row gap-4 items-center">
        <Button
          variant="contained"
          startIcon={<ChevronLeft />}
          sx={{
            backgroundColor: "var(--light-blue)",
            color: "var(--dark-blue)",
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </Button>
        <h1 className="font-bold text-2xl">Édition du planning</h1>
      </div>

      <MapContainer
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={onBuildingChange}
        selectedBuildingFloors={selectedBuildingFloors}
        selectedFloorId={selectedFloorId}
        onFloorChange={(id) => setSelectedFloorId(id)}
        date={date}
        onDateChange={setDate}
        selectedFloor={selectedFloor}
        selectedRooms={selectedRooms}
        loading={loading || loadingRoom}
        error={error || errorRoom}
      />
    </div>
  );
};

export default Edit;
