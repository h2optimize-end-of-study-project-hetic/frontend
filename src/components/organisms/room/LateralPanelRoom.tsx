import { Box, Typography, Stack, TextField, MenuItem } from "@mui/material";
import type { RoomWithTag } from "../../../types/roomWithTag";
import type { Building } from "../../../types/Building";

type Props = {
  rooms: RoomWithTag[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  buildingFilter: string;
  onBuildingFilterChange: (value: string) => void;
  floorFilter: string;
  onFloorFilterChange: (value: string) => void;
  children?: React.ReactNode;
  buildings?: Building[];
};

export default function LateralPanelRoom({
  rooms,
  searchTerm,
  onSearchChange,
  buildingFilter,
  onBuildingFilterChange,
  floorFilter,
  onFloorFilterChange,
  children,
  buildings = [],
}: Props) {

  function extractFloors(data: RoomWithTag[]) {
    const floors: number[] = [];
    data.forEach((room) => {
      if (room.floor !== undefined && room.floor !== null) {
        floors.push(room.floor);
      }
    });
    return Array.from(new Set(floors)).sort((a, b) => a - b);
  }

  const floors = extractFloors(rooms);

  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="100%"
      maxHeight="100%"
    >
      <Stack spacing={2} color="black">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Liste des salles</Typography>
        </Stack>
        <TextField
          placeholder="Rechercher"
          fullWidth
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
        />

        <Typography fontWeight={500}>Filtres</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Bâtiment"
            fullWidth
            value={buildingFilter}
            onChange={(e) => onBuildingFilterChange(e.target.value)}
            size="small"
          >
            <MenuItem value="">Tous</MenuItem>
            {buildings.map((building) => (
              <MenuItem key={building.id} value={String(building.id)}>
                {building.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Étage"
            fullWidth
            value={floorFilter}
            onChange={(e) => onFloorFilterChange(String(e.target.value))}
            size="small"
          >
            <MenuItem value="">Tous</MenuItem>
            {floors.map((floor) => (
              <MenuItem key={floor} value={String(floor)}>
                {floor === 0 ? "RDC" : `Étage ${floor}`}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>

      {children}
    </Box>
  );
}
