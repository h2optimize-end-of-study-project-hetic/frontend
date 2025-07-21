type Props = {
  buildingName: string;
  floorName: string;
};

const MapHeader = ({ buildingName, floorName }: Props) => {
  return (
    <div className="w-fit bg-white font-bold !my-3.5 !px-4 !py-2 text-xl">
      🏢 {buildingName} – {floorName}
    </div>
  );
};

export default MapHeader;
