import {
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import type { TagListItem } from "../../../types/tagListItem";

type Props = {
  tags: TagListItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roomFilter: string;
  onRoomFilterChange: (value: string) => void;
  buildingFilter: string;
  onBuildingFilterChange: (value: string) => void;
};


export default function FilerTagList({
  searchTerm,
  onSearchChange,
  roomFilter,
  onRoomFilterChange,
  buildingFilter,
  onBuildingFilterChange,
}: Props) {
  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="100%"
      maxWidth="350px"
    >
      <Stack spacing={2} color="black">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Liste des balises</Typography>
        </Stack>{" "}
        <TextField
          placeholder="Rechercher"
          fullWidth
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Typography fontWeight={500}>Filter par :</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Pièce"
            fullWidth
            value={roomFilter}
            onChange={(e) => onRoomFilterChange(e.target.value)}
          >
            <MenuItem value="">Toutes</MenuItem>
            <MenuItem value="F45">F45</MenuItem>
            <MenuItem value="A105">A105</MenuItem>
          </TextField>

          <TextField
            select
            label="Bâtiment"
            fullWidth
            value={buildingFilter}
            onChange={(e) => onBuildingFilterChange(e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
          </TextField>
        </Stack>         
      </Stack>
    </Box>
  );
}
