import { useEffect, useState } from "react";
import {
  Box, TextField, Button, Stack, Typography, MenuItem,
  Backdrop, CircularProgress
} from "@mui/material";
import { styled } from '@mui/material/styles';

import type { Building } from "../../../types/Building";
import { useAuthHeaders } from "../../../hooks/useAuthHeader";
import { useSnackbar } from "../../../context/SnackbarContext";

const NameTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    fontSize: "1.5rem",
    fontWeight: 500,
    lineHeight: 1.6,
    color: "var(--black)",
    paddingTop: "8.5px",
    paddingBottom: "8.5px",
  },
});

type CreateRoom = {
  name: string;
  description?: string;
  floor?: number;
  building_id?: number;
  area?: number;
  capacity?: number;
  start_at?: string;
  end_at?: string;
};

const initRoom: CreateRoom = {
  name: "",
  description: "",
  floor: undefined,
  building_id: undefined,
  area: undefined,
  capacity: undefined,
  start_at: "",
  end_at: ""
};

type Props = {
  setAllRooms: Function;
  buildings: Building[]
};

export default function RoomCreate({ setAllRooms, buildings }: Props) {
  const headers = useAuthHeaders();
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<CreateRoom>(initRoom);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!createdRoom.name.trim()) {
      showMessage('Le nom de la pièce est obligatoire', 'error');
      return;
    }

    setLoading(true);

    const payload: CreateRoom = {
      name: createdRoom.name,
      description: createdRoom.description,
      floor: createdRoom.floor,
      building_id: createdRoom.building_id,
      area: createdRoom.area,
      capacity: createdRoom.capacity,
      start_at: createdRoom.start_at
        ? new Date(createdRoom.start_at).toISOString()
        : undefined,
      end_at: createdRoom.end_at
        ? new Date(createdRoom.end_at).toISOString()
        : undefined,
    };

    Object.keys(payload).forEach(key => {
      const value = payload[key as keyof CreateRoom];
      if (value === undefined || value === "") {
        delete payload[key as keyof CreateRoom];
      }
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ room: payload }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      try {
        const refreshRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room/tag?cursor=id=${data.id}&limit=1`,
          { headers }
        );
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.data && refreshData.data.length > 0) {
            setAllRooms((prev: any) => [...prev, refreshData.data[0]]);
          } else {
            setAllRooms((prev: any) => [...prev, { ...data, tags: [] }]);
          }
        } else {
          setAllRooms((prev: any) => [...prev, { ...data, tags: [] }]);
        }
      } catch (refreshErr) {
        setAllRooms((prev: any) => [...prev, { ...data, tags: [] }]);
      }

      showMessage('Pièce créée', 'success');
      setCreatedRoom(initRoom);

    } catch (err) {
      showMessage('Erreur lors de la création', 'error');
      console.error("Erreur dans handleSubmit:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="100%"
    >
      <form onSubmit={handleSubmit} onReset={() => setCreatedRoom(initRoom)}>
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        
        <Stack spacing={3}>
          <NameTextField
            label="Nom"
            value={createdRoom?.name ?? ''}
            onChange={(e) => {
              setCreatedRoom(prev => ({ ...prev, name: e.target.value }));
            }}
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <TextField
            label="Description"
            placeholder="Description de la pièce..."
            value={createdRoom?.description ?? ''}
            onChange={(e) => {
              setCreatedRoom(prev => ({ ...prev, description: e.target.value }));
            }}
            fullWidth
            multiline
            rows={2}
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Bâtiment"
              select
              value={createdRoom?.building_id ?? ""}
              onChange={(e) => {
                setCreatedRoom(prev => ({
                  ...prev,
                  building_id: e.target.value === "" ? undefined : Number(e.target.value)
                }));
              }}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            >
              <MenuItem value="">Aucun bâtiment</MenuItem>
              {buildings?.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Étage"
              type="number"
              value={createdRoom?.floor ?? ""}
              onChange={(e) => {
                setCreatedRoom(prev => ({
                  ...prev,
                  floor: e.target.value ? Number(e.target.value) : undefined
                }));
              }}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Capacité"
              type="number"
              value={createdRoom?.capacity ?? ""}
              onChange={(e) => {
                setCreatedRoom(prev => ({
                  ...prev,
                  capacity: e.target.value ? Number(e.target.value) : undefined
                }));
              }}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Surface (m²)"
              type="number"
              value={createdRoom?.area ?? ""}
              onChange={(e) => {
                setCreatedRoom(prev => ({
                  ...prev,
                  area: e.target.value ? Number(e.target.value) : undefined
                }));
              }}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Date début"
              type="date"
              value={createdRoom?.start_at ?? ""}
              onChange={(e) => {
                setCreatedRoom(prev => ({ ...prev, start_at: e.target.value }));
              }}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Date fin"
              type="date"
              value={createdRoom?.end_at ?? ""}
              onChange={(e) => {
                setCreatedRoom(prev => ({ ...prev, end_at: e.target.value }));
              }}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              type="reset"
              sx={{
                color: 'var(--dark-red)',
                backgroundColor: 'var(--light-red)',
                p: '6px 12px',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.10)',
                fontWeight: 500,
              }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                color: 'var(--dark-green)',
                backgroundColor: 'var(--light-green)',
                p: '6px 12px',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.10)',
                fontWeight: 500,
              }}
            >
              Créer
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}