import { useEffect, useState } from "react";
import { buildings } from "../components/_map/MapData";
import MapView from "../components/_map/MapView";
import FloorSelector from "../components/_map/FloorSelector";
import BuildingSelector from "../components/_map/BuildingSelector";
// import MapWithDrawWrapper from "../components/_map/MapViewWithDraw";
import MapHeader from "../components/_map/MapHeader";
import Selector from "../components/_map/Selector";
import type { Building, Etage } from "../components/_map/MapType";

const base = import.meta.env.BASE_URL;

function Dashboard() {
  const [selectedBuildingId, setSelectedBuildingId] = useState(buildings[0].id);
  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);

  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);

  const selectedFloor = selectedBuilding?.etages.find(
    (f) => f.id === selectedFloorId
  );

  const currentBuilding = buildings.find((b) => b.id === selectedBuildingId);

  const onBuildingChange = (id: string) => {
    setSelectedBuildingId(id);
  };

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
        <Selector<Building>
          options={buildings}
          value={selectedBuildingId}
          onChange={onBuildingChange}
          getLabel={(b) => b.name}
          getId={(b) => b.id}
        />
        {currentBuilding ? (
          <Selector<Etage>
            options={currentBuilding.etages}
            value={selectedFloorId ?? ""}
            onChange={(id) => setSelectedFloorId(id)}
            getLabel={(floor) => floor.name}
            getId={(floor) => floor.id}
          />
        ) : null}
      </div>

      <MapHeader
        buildingName={selectedBuilding.name}
        floorName={selectedFloor.name}
      />
      <div style={{ padding: "10px" }}>
        {/* <MapWithDrawWrapper
          image={selectedFloor.image}
          bounds={selectedFloor.bounds}
        /> */}
        <MapView
          image={base + selectedFloor.image}
          bounds={selectedFloor.bounds}
          rooms={selectedFloor.rooms}
        />
      </div>
    </>
  );
}

export default Dashboard;
