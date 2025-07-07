type Props = {
  buildings: Building[];
  selectedBuildingId: string;
  onBuildingChange: (buildingId: string) => void;
};

const RoomSelector = ({
  buildings,
  selectedBuildingId,
  onBuildingChange,
}: Props) => {
  return (
    <div>
      <select
        id="building-select"
        value={selectedBuildingId}
        onChange={(e) => onBuildingChange(e.target.value)}
      >
        {buildings.map((building) => (
          <option key={building.id} value={building.id}>
            {building.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoomSelector;
