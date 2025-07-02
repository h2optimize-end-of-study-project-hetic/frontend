type Props = {
  currentBuilding: Building;
  selectedFloorId: string;
  onFloorChange: (floorId: string) => void;
};

const FloorSelector = ({
  currentBuilding,
  selectedFloorId,
  onFloorChange,
}: Props) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
      {currentBuilding.etages.map((floor) => (
        <button
          key={floor.id}
          onClick={() => onFloorChange(floor.id)}
          style={{
            padding: "8px 12px",
            background: floor.id === selectedFloorId ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {floor.name}
        </button>
      ))}
    </div>
  );
};

export default FloorSelector;
