import {
  Box, TextField, Button, Stack, Typography, MenuItem
} from "@mui/material";
import type { Tag } from "../../../types/tag";

type Props = {
  tag: Tag;
  onChange: (field: keyof Tag, value: string) => void;
  onCreate: () => void;
  onCancel?: () => void;
};

export default function DashboardTagCreate({ tag, onChange, onCreate, onCancel }: Props) {
  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="100%"
    >
      <Stack spacing={3}>
        <Typography variant="h5" color='var(--black)'>Créer une nouvelle balise</Typography>

        <TextField
          label="Nom"
          value={tag.name}
          onChange={(e) => onChange("name", e.target.value)}
          fullWidth
        />

        <TextField
          label="Identifiant unique"
          value={tag.source_address}
          onChange={(e) => onChange("source_address", e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          value={tag.description}
          onChange={(e) => onChange("description", e.target.value)}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <TextField
            label="Bâtiment"
            select
            value={tag.building}
            onChange={(e) => onChange("building", e.target.value)}
            fullWidth
          >
            <MenuItem value="A">Bâtiment A</MenuItem>
            <MenuItem value="B">Bâtiment B</MenuItem>
          </TextField>

          <TextField
            label="Pièce"
            select
            value={tag.room}
            onChange={(e) => onChange("room", e.target.value)}
            fullWidth
          >
            <MenuItem value="F45">F45</MenuItem>
            <MenuItem value="A105">A 105</MenuItem>
          </TextField>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Date installation dans la pièce"
            type="date"
            value={tag.installedAt}
            onChange={e => onChange("installedAt", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Date de fin"
            type="date"
            value={tag.removedAt}
            onChange={e => onChange("removedAt", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={onCancel}
            sx={{
              color: 'var(--dark-red)',
              backgroundColor: 'var(--light-red)',
            }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={onCreate}
            sx={{
              color: 'var(--dark-green)',
              backgroundColor: 'var(--light-green)',
            }}
          >
            Créer
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
