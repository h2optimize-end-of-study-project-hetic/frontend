import { useEffect, useState } from "react";
import { mapData, type FloorKey } from "../components/_map/MapData";
import MapView from "../components/_map/MapView";
import FloorSelector from "../components/_map/FloorSelector";
import RoomSelector from "../components/_map/RoomSelector";
import MapWithDrawWrapper from "../components/_map/MapViewWithDraw";
import MapHeader from "../components/_map/MapHeader";

function Dashboard() {
  const [selectedBuildingId, setSelectedBuildingId] = useState(
    mapData.buildings[0].id
  );
  const selectedBuilding = mapData.buildings.find(
    (b) => b.id === selectedBuildingId
  )!;

  const [selectedFloorId, setSelectedFloorId] = useState(
    selectedBuilding.etages[0].id
  );
  const selectedFloor = selectedBuilding.etages.find(
    (f) => f.id === selectedFloorId
  )!;

  // Reset floor when building changes
  useEffect(() => {
    setSelectedFloorId(selectedBuilding.etages[0].id);
  }, [selectedBuildingId]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <RoomSelector
          buildings={mapData.buildings}
          selectedBuildingId={selectedBuildingId}
          onBuildingChange={setSelectedBuildingId}
        />
        <FloorSelector
          currentBuilding={selectedBuilding}
          selectedFloorId={selectedFloorId}
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
          rooms={selectedFloor.rooms}
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
