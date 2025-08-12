import type { Building } from "./MapType";

type Props = {
  buildings: Building[];
  selectedBuildingId: string;
  onBuildingChange: (buildingId: string) => void;
};

const BuildingSelector = ({
  buildings,
  selectedBuildingId,
  onBuildingChange,
}: Props) => {
  return (
    <div>
      <select
        className="bg-white !p-2 border-0 rounded-[8px]"
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

export default BuildingSelector;
