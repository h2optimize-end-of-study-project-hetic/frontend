import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  MenuItem,
} from "@mui/material";
import type { User } from "../../../types/user";

type Props = {
  user: User;
  onChange: (field: keyof User, value: string) => void;
  onUpdate: () => void;
  onCancel?: () => void;
};

export default function DashboardUserEdit({
  user,
  onChange,
  onUpdate,
  onCancel,
}: Props) {
  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="100%"
    >
      <Stack spacing={3}>
        <Typography variant="h5" color="var(--black)">
          Utilisateur: {user.lastname}
        </Typography>

        <Typography
          sx={{
            color: "var(--black)",
            backgroundColor: "var(--light-blue)",
            p: "6px 12px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            display: "inline-block",
            fontWeight: 500,
            fontSize: "1.1rem",
            width: "146px",
          }}
        >
          {user.firstname} {user.lastname}
        </Typography>

        <TextField
          label="Nom"
          value={user.lastname}
          onChange={(e) => {
            onChange("lastname", e.target.value);
          }}
          fullWidth
        />
        <TextField
          label="Prénom"
          value={user.firstname}
          onChange={(e) => {
            onChange("firstname", e.target.value);
          }}
          fullWidth
        />
        <TextField
          label="Email"
          value={user.email}
          onChange={(e) => {
            onChange("email", e.target.value);
          }}
          fullWidth
        />
        <TextField
          label="Numéro de téléphone"
          value={user.phone_number}
          onChange={(e) => {
            onChange("phone_number", e.target.value);
          }}
          fullWidth
        />

        <Stack direction="row" spacing={2} paddingBottom={4}>
          <TextField
            label="Rôle"
            select
            value={user.role}
            onChange={(e) => onChange("role", e.target.value)}
            fullWidth
          >
            <MenuItem value="guest">Invité</MenuItem>
            <MenuItem value="technician">Technicien</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={onCancel}
          sx={{
            color: "var(--dark-red)",
            backgroundColor: "var(--light-red)",
            p: "6px 12px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.10)",
            fontWeight: 500,
          }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={onUpdate}
          sx={{
            color: "var(--dark-green)",
            backgroundColor: "var(--light-green)",
            p: "6px 12px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.10)",
            fontWeight: 500,
          }}
        >
          Éditer
        </Button>
      </Stack>
    </Box>
  );
}
