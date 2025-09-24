import { Box, Typography, Stack, TextField, MenuItem } from "@mui/material";

import type { Tag } from "../../../types/tag";


type Props = {
  tags: Tag[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roomFilter: string;
  onRoomFilterChange: (value: string) => void;
  buildingFilter: string;
  onBuildingFilterChange: (value: string) => void;
  children?: React.ReactNode;
};


export default function LateralPanel({ tags, searchTerm, onSearchChange, roomFilter, onRoomFilterChange, buildingFilter, onBuildingFilterChange, children }: Props) {

  function extractRoomAndBuilding(data: Tag[]) {
    const rooms: { id: number; name: string }[] = [];
    const buildings: { id: number; name: string }[] = [];

    data.forEach(tag => {
      if (tag.rooms) {
        tag.rooms.forEach(r => {
          if (r.room) {
            rooms.push({ id: r.room.id, name: r.room.name });
            if (r.room.building) {
              buildings.push({ id: r.room.building.id, name: r.room.building.name });
            }
          }
        });
      }
    });

    const uniqueRooms = Array.from(new Map(rooms.map(r => [r.id, r])).values());
    const uniqueBuildings = Array.from(new Map(buildings.map(b => [b.id, b])).values());

    return { rooms: uniqueRooms, buildings: uniqueBuildings };
  }

  const { rooms, buildings } = extractRoomAndBuilding(tags);

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
          <Typography variant="h6">Liste des balises</Typography>
        </Stack>{" "}
        <TextField
          placeholder="Rechercher"
          fullWidth
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
        />
        <Typography fontWeight={500}>Filter</Typography>
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
              <MenuItem key={building.id} value={building.name}>
                {building.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Pièce"
            fullWidth
            value={roomFilter}
            onChange={(e) => onRoomFilterChange(e.target.value)}
            size="small"
          >
            <MenuItem value="">Toutes</MenuItem>
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.name}>
                {room.name}
              </MenuItem>
            ))}
          </TextField>

        </Stack>
      </Stack>

      {children}
    </Box>
  );
}
