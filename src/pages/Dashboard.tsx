import { useEffect, useState } from "react";
import MapView from "../components/_map/MapView";
import MapHeader from "../components/_map/MapHeader";
import Selector from "../components/_map/Selector";

import type { FloorMap } from "../types/map";
import { useMaps } from "../hooks/useMap";

function Dashboard() {
  const backendURLAPI = import.meta.env.VITE_BACKEND_URL_API;

  const { maps, loading, error } = useMaps();

  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null
  );
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);

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

  if (loading) return <div>Chargement des maps...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!selectedFloor) return <div>Aucune map trouvée</div>;

  return (
    <>
      <div className="flex flex-row gap-2.5 w-full bg-(--light-blue) rounded-[12px] items-center !p-3">
        <Selector<{ id: number; name: string }>
          options={buildings}
          value={selectedBuildingId ?? 0}
          onChange={(id) => onBuildingChange(Number(id))}
          getLabel={(b) => b.name}
          getId={(b) => b.id}
        />

        {selectedBuildingFloors.length > 0 && (
          <Selector<FloorMap>
            options={selectedBuildingFloors}
            value={selectedFloorId ?? 0}
            onChange={(id) => setSelectedFloorId(Number(id))}
            getLabel={(floor) => floor.file_name.split(".")[0]}
            getId={(floor) => floor.id}
          />
        )}
      </div>

      <MapHeader
        buildingName={`Building ${selectedBuildingId}`}
        floorName={selectedFloor.file_name}
      />

      <div style={{ padding: "10px" }}>
        {/* <MapWithDrawWrapper
          image={`${backendURLAPI}/map/img/${selectedFloor.id}`}
          bounds={[
            [0, 0],
            [selectedFloor.length, selectedFloor.width],
          ]}
        /> */}
        <MapView
          image={`${backendURLAPI}/map/img/${selectedFloor.id}`}
          bounds={[
            [0, 0],
            [selectedFloor.length, selectedFloor.width],
          ]}
          rooms={[]} // attente du crud room
        />
      </div>
    </>
  );
}

export default Dashboard;
