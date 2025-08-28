import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMaps } from "../hooks/useMap";
import { useRooms } from "../hooks/useRoom";
import MapView from "../components/_map/MapView";
import MapTitle from "../components/_map/MapTitle";
import Button from "@mui/material/Button";
import MapHeader from "../components/_map/MapHeader";
// import MapWithDrawWrapper from "../components/_map/MapViewWithDraw";

function Dashboard() {
  const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;
  const navigate = useNavigate();
  const { maps, loading, error } = useMaps();
  const { rooms, loadingRoom, errorRoom } = useRooms();

  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null
  );
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");

  // TODO api call building
  const buildings = Array.from(new Set(maps.map((m) => m.building_id))).map(
    (id) => ({ id, name: `Bâtiment ${id}` })
  );

  // Floors pour le bâtiment sélectionné
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

  // Init : choisir le premier building/floor
  useEffect(() => {
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

  if (loading || loadingRoom)
    return (
      <div>
        {" "}
        {loading ? "Chargement des plans..." : "Chargement des salles..."}
      </div>
    );
  if (error || errorRoom) return <div>{error ? error : errorRoom}</div>;
  if (!selectedFloor) return <div>Aucun plan trouvé</div>;

  return (
    <>
      <MapHeader
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={onBuildingChange}
        selectedBuildingFloors={selectedBuildingFloors}
        selectedFloorId={selectedFloorId}
        onFloorChange={(id) => setSelectedFloorId(id)}
        date={date}
        onDateChange={setDate}
      />

      <MapTitle
        buildingName={`Building ${selectedBuildingId}`}
        floorName={selectedFloor.file_name}
      />
      <div className="p-2.5 relative">
        <div className="absolute z-10 !pt-2.5 !pl-13 ">
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
        {/* <MapWithDrawWrapper
          image={`${backendURLAPI}/api/v1/map/img/${selectedFloor.id}`}
          bounds={[
            [0, 0],
            [selectedFloor.length, selectedFloor.width],
          ]} 
        /> */}
        <MapView
          image={`${backendURLAPI}/api/v1/map/img/${selectedFloor.id}`}
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

export default Dashboard;
