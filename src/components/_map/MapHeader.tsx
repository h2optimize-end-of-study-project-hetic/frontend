type Props = {
  buildingName: string;
  floorName: string;
};

const MapHeader = ({ buildingName, floorName }: Props) => {
  return (
    <div
      style={{
        width: "fit-content",
        background: "rgba(255, 255, 255, 0.8)",
        padding: "8px 16px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "1.2rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        margin: "auto",
      }}
    >
      🏢 {buildingName} – {floorName}
    </div>
  );
};

export default MapHeader;
