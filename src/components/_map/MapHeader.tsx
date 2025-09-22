import type { FloorMap } from "../../types/floorMap";
import Selector from "./Selector";

type Building = { id: number; name: string };

interface MapHeaderProps {
  buildings: Building[];
  selectedBuildingId: number | null;
  onBuildingChange: (id: number) => void;
  selectedBuildingFloors: FloorMap[];
  selectedFloorId: number | null;
  onFloorChange: (id: number) => void;
  date: string;
  onDateChange: (date: string) => void;
}

export default function MapHeader({
  buildings,
  selectedBuildingId,
  onBuildingChange,
  selectedBuildingFloors,
  selectedFloorId,
  onFloorChange,
  date,
  onDateChange,
}: MapHeaderProps) {
  return (
    <div className="flex flex-row gap-2.5 justify-between w-full bg-(--light-blue) rounded-[12px] items-center !p-3">
      <div className="flex flex-row gap-2.5">
        <Selector<Building>
          options={buildings}
          value={selectedBuildingId ?? ""}
          onChange={(id) => onBuildingChange(Number(id))}
          getLabel={(b) => b.name}
          getId={(b) => b.id}
        />

        {selectedBuildingFloors.length > 0 && (
          <Selector<FloorMap>
            options={selectedBuildingFloors}
            value={selectedFloorId ?? ""}
            onChange={(id) => onFloorChange(Number(id))}
            getLabel={(floor) => "Étage " + String(floor.floor)}
            getId={(floor) => floor.id}
          />
        )}
      </div>
      <div>
        <label htmlFor="Date">Date : </label>
        <input
          type="date"
          name="Date"
          id="Date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-white !p-2 rounded-[8px] min-w-[130px]"
        />
      </div>
    </div>
  );
}
