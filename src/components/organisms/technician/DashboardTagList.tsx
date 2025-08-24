import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import type { TagListItem } from "../../../types/tagListItem";

type Props = {
  tags: TagListItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roomFilter: string;
  onRoomFilterChange: (value: string) => void;
  buildingFilter: string;
  onBuildingFilterChange: (value: string) => void;
};


export default function TechnicianTagList({
  tags,
  onEdit,
  onDelete,
  onCreate,
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
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "var(--light-blue)",
              color: "var(--dark-blue)",
              minWidth: "32px",
              padding: 0.4,
              fontSize: "1.2rem",
              lineHeight: 1,
              "&:hover": {
                backgroundColor: "var(--dark-blue)",
                color: "var(--light-blue)",
              }
            }}
            onClick={() => onCreate()}
          >
            +
          </Button>
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
        {tags.map((tag) => (
          <Box key={tag.id} bgcolor="var(--lightest-grey)" p={2} borderRadius={2}>
            <Typography fontWeight={600}>Balise {tag.id}</Typography>
            <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
              <Box
                bgcolor="var(--light-blue)"
                px={2}
                py={0.5}
                borderRadius={2}
                boxShadow="0px 2px 4px rgba(0,0,0,0.1)"
              >
                {tag.source_address}
              </Box>
              {tag.room && (
                <Box bgcolor="var(--light-blue)" px={2} py={0.5} borderRadius={2}>
                  {tag.room}
                </Box>
              )}
              {tag.building && (
                <Box bgcolor="var(--light-blue)" px={2} py={0.5} borderRadius={2}>
                  {tag.building}
                </Box>
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              mt={2}
              justifyContent="space-between"
            >
              <Button
                onClick={() => onDelete(tag.id)}
                variant="contained"
                sx={{
                  backgroundColor: "var(--light-red)",
                  color: "var(--dark-red)",
                }}
              >
                Supprimer
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "var(--light-green)",
                  color: "var(--dark-green)",
                }}
                onClick={() => onEdit(tag.id)}
              >
                Éditer
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
