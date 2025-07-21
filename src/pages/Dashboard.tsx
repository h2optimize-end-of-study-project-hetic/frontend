import { useEffect, useState } from "react";
import { buildings } from "../components/_map/MapData";
import MapView from "../components/_map/MapView";
import FloorSelector from "../components/_map/FloorSelector";
import BuildingSelector from "../components/_map/BuildingSelector";
import MapWithDrawWrapper from "../components/_map/MapViewWithDraw";
import MapHeader from "../components/_map/MapHeader";

function Dashboard() {
  const [selectedBuildingId, setSelectedBuildingId] = useState(buildings[0].id);
  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);

  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);

  const selectedFloor = selectedBuilding?.etages.find(
    (f) => f.id === selectedFloorId
  );

  // Lors du changement de bâtiment, on met à jour le floorId
  useEffect(() => {
    if (selectedBuilding && selectedBuilding.etages.length > 0) {
      setSelectedFloorId(selectedBuilding.etages[0].id);
    } else {
      setSelectedFloorId(null);
    }
  }, [selectedBuildingId, selectedBuilding]);

  // Tant qu'on a pas de floor sélectionné, on peut afficher un loader ou rien
  if (!selectedFloor || !selectedBuilding) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <div className="flex flex-row gap-2.5 w-full bg-(--light-blue) rounded-[12px] items-center !p-3">
        <BuildingSelector
          buildings={buildings}
          selectedBuildingId={selectedBuildingId}
          onBuildingChange={setSelectedBuildingId}
        />
        <FloorSelector
          currentBuilding={selectedBuilding}
          selectedFloorId={selectedFloorId!}
          onFloorChange={setSelectedFloorId}
        />
      </div>

      <MapHeader
        buildingName={selectedBuilding.name}
        floorName={selectedFloor.name}
      />
      <div style={{ padding: "10px" }}>
        <MapWithDrawWrapper
          image={selectedFloor.image}
          bounds={selectedFloor.bounds}
        />
        <MapView
          image={selectedFloor.image}
          bounds={selectedFloor.bounds}
          rooms={selectedFloor.rooms}
        />
      </div>
    </>
  );
}

export default Dashboard;
