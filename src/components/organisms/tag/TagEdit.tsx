import { useEffect, useMemo, useState } from "react";
import {
  Box, TextField, Button, Stack, Typography, MenuItem,
  Divider,
  Backdrop,
  CircularProgress
} from "@mui/material";
import { Add } from "@mui/icons-material";
import type { Tag } from "../../../types/tag";
import { styled } from '@mui/material/styles';

import { type Room } from "../../../types/room";
import { type Building } from "../../../types/Building";
import { useAuthHeaders } from "../../../hooks/useAuthHeader";
import { useSnackbar } from "../../../context/SnackbarContext";
import { useGetCurrentRoom } from "../../../hooks/tag/useGetCurrentRoom";


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

type TagRequestWithRoom = {
  name?: string,
  id?: number,
  source_address?: string,
  description?: string,
  room_id?: number | null,
  start_at?: string |null,
  end_at?: string | null
};
 
type Props = {
  tag?: Tag;
  setTag: Function;
};

export default function TagEdit({ tag, setTag }: Props) {
  const headers = useAuthHeaders();
  const { showMessage } = useSnackbar()
  const [rooms, setRooms]  = useState<Room[]>()
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings]  = useState<Building[]>()
  const [selectedRoom, setSelectedRoom] = useState<number | "">("");
  const [updatedTag, setUpdatedTag] = useState<TagRequestWithRoom>();
  const [selectedBuilding, setSelectedBuilding] = useState<number | "">("");
  const [currentTagRoomId, setCurrentTagRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (!tag) return;

    setUpdatedTag({
      name: tag.name,
      id: tag.id,
      source_address: tag.source_address,
      description: tag.description
    });

    const currentTagRoom = useGetCurrentRoom(tag);
    if (currentTagRoom) {
      setCurrentTagRoomId(currentTagRoom.id);

      setUpdatedTag((prev) =>
        prev
          ? {
              ...prev,
              room_id: currentTagRoom.room.id,
              start_at: new Date(currentTagRoom.start_at).toISOString().split("T")[0],
              end_at: currentTagRoom.end_at
                ? new Date(currentTagRoom.end_at).toISOString().split("T")[0]
                : undefined,
            }
          : prev
      );
    } else {      
      setUpdatedTag((prev) =>
        prev ? {
          ...prev,
          room_id: null,
          start_at: null,
          end_at: null
        } : prev
      );
      setCurrentTagRoomId(null);
    }
  }, [tag]);

  useEffect(() => {
    if (rooms && buildings && currentTagRoomId) {
      const currentRoom = rooms.find((r) => r.id === updatedTag?.room_id);
      if (currentRoom) {
        setSelectedRoom(currentRoom.id);
        setSelectedBuilding(currentRoom.building_id);
      }
    }
  }, [rooms, buildings, currentTagRoomId, updatedTag]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBuildings, resRooms] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL_API}/api/v1/building?limit=10000`, { headers }),
          fetch(`${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room?limit=10000`, { headers }),
        ]);

        if (!resBuildings.ok || !resRooms.ok) throw new Error("Erreur HTTP");

        const [dataBuildings, dataRooms] = await Promise.all([resBuildings.json(), resRooms.json()]);

        setBuildings(dataBuildings.data);
        setRooms(dataRooms.data);
      } catch (err) {
        showMessage('Erreur lors de la récupération des données', 'error');
        console.error(err);
      }
    };
    fetchData();
  }, [headers]);


  const refresh = async (id: number) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag/${id}?with_rooms=true`,
      { headers }
    );
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    const data = await res.json();
    return data
  }

  const handleChange = <K extends keyof TagRequestWithRoom>(field: K, value: TagRequestWithRoom[K]) => {
    setUpdatedTag((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (!updatedTag || !updatedTag.id) return;

    setLoading(true)
    
    let payload:TagRequestWithRoom = {};

    const currentTagRoom = useGetCurrentRoom(tag);

    if (updatedTag.name && updatedTag.name !== tag?.name) {
      payload["name"] = updatedTag.name;
    }

    if (updatedTag.description !== tag?.description) {
      payload["description"] = updatedTag.description;
    }

    if (
      updatedTag.room_id && updatedTag.room_id !== currentTagRoom?.room.id
    ) {
      payload["room_id"] = updatedTag.room_id;
    }
  

    if (
      updatedTag.start_at != null && (!currentTagRoom || updatedTag.start_at !== new Date(currentTagRoom.start_at).toISOString().split("T")[0])
    ) {
      payload["room_id"] = updatedTag.room_id;
      payload["start_at"] = `${new Date(updatedTag.start_at).toISOString()}`;
    }
    
    if (
      updatedTag.end_at != null &&  (!currentTagRoom || updatedTag.end_at !== (new Date(currentTagRoom?.end_at).toISOString().split("T")[0] ??''))
    ) {
      payload["room_id"] = updatedTag.room_id;
      payload["end_at"] = `${new Date(updatedTag.end_at).toISOString()}`;
    }
    
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag/${updatedTag.id}/room`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ payload: payload }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const updated = await refresh(updatedTag.id)
      setTag(updated)

      showMessage('Balise mise à jour', 'success');
    } catch (err) {
      showMessage('Erreur lors de la mise a jour', 'error');
      console.error("Erreur dans handleUpdate:", err);
    } finally{
      setLoading(false)
    }
  };



  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    setUpdatedTag(tag) 
  }
  
  const filteredRooms = useMemo(() => {
    if (!selectedBuilding) return rooms;
    return rooms?.filter((room) => room.building_id === selectedBuilding) ?? [];
  }, [rooms, selectedBuilding]);


  const handleChangeRoom = (value: string) => {
    const newValue = value === "" ? "" : Number(value);
    setSelectedRoom(newValue);

    if (newValue) {
      const room = rooms?.find((roomElement) => roomElement.id === newValue);

      if (room) {
        setSelectedBuilding(room.building_id);

        setUpdatedTag((prev) => {
          if (!prev) return prev
          return { ...prev, room_id: room.id };
        });
      }
    }
  };

  const handleChangeBuilding = (value: string) => {
    const newValue = value === "" ? "" : Number(value);
    setSelectedBuilding(newValue);
    setSelectedRoom("");
  }

  if (!tag || !updatedTag) {
    return <Typography color="text.secondary">Aucune balise sélectionnée</Typography>;
  }

  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="100%"
    >
      <form onSubmit={(event)=>handleSubmit(event)} onReset={(event)=>handleReset(event)}>
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} mt={1} justifyContent="space-between" alignItems="center" width={'100%'}>
              <NameTextField
                value={updatedTag.name?? ''}
                onChange={(e) => {
                  handleChange("name", e.target.value);
                }}
              />
              <Typography
                sx={{
                  color: 'var(--black)',
                  backgroundColor: 'var(--light-light-blue)',
                  p: '6px 24px',
                  borderRadius: '48px',
                  display: 'inline-block',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  width: 'fit-content'
                }}
              >
                {updatedTag.source_address}
              </Typography>
            </Stack>

            <TextField
              label="Description"
              value={updatedTag.description ?? ''}
              onChange={(e) => {
                handleChange("description", e.target.value);
              }}
              fullWidth
              multiline
              rows={2}
              size="small"
            />

            {
              currentTagRoomId === null  && (
                <Button
                  variant="text"
                  onClick={() => setCurrentTagRoomId(0)}
                  sx={{
                    color: 'var(--dark-green)',
                    borderColor: 'var(--dark-green)',
                    p: '6px 12px',
                    borderRadius: '4px',
                    fontWeight: 500,
                    width: 'fit-content',
                    ":hover" :{
                      backgroundColor : 'var(--light-green)',
                    }
                  }}
                >
                
                  <Add/>  
                  Ajouter une pièce
                </Button>
              )
            }

            {
              (updatedTag.room_id || currentTagRoomId !== null ) && (
                <>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Bâtiment"
                      select
                      value={selectedBuilding?? ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeBuilding(event.target.value)}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">Aucun bâtiment</MenuItem>
                      {buildings?.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {building.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Pièce"
                      select
                      value={selectedRoom?? ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeRoom(event.target.value)}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="">Aucune pièce</MenuItem>
                      {filteredRooms?.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Date installation dans la pièce"
                      type="date"
                      value={updatedTag.start_at?? ''}
                      onChange={(e) => {
                        handleChange("start_at", e.target.value);
                      }}                        
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Date de fin"
                      type="date"
                      value={updatedTag.end_at?? ''}
                      onChange={(e) => {
                        handleChange("end_at", e.target.value);
                      }}      
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      fullWidth
                      size="small"
                    />
                  </Stack>
                </>
              )
            }

            <Stack>
              <Typography color='var(--black)'>
                Créée le : {tag.created_at ? new Date(tag.created_at).toLocaleDateString() : "—"}
              </Typography>
              <Typography color='var(--black)'>
                Modifiée le : {tag.updated_at ? new Date(tag.updated_at).toLocaleDateString() : "—"}
              </Typography>
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
                Éditer
              </Button>
            </Stack>
          </Stack>
        </form>

        {tag.rooms && (
          <Stack spacing={1} sx={{marginTop:'1rem'}}>
            <Typography variant="subtitle1" color="var(--black)" fontWeight={600} >
              Historique de localisation
            </Typography>
            {tag.rooms.map((roomLink) => {
              const isCurrent = currentTagRoomId === roomLink.id;

              return (
                <Box
                  key={roomLink.id}
                  p={1}
                  borderRadius={2}
                  bgcolor={isCurrent ? "var(--light-light-blue)" : ""}
                >
                  <Typography variant="subtitle2" color="var(--black)">
                    {roomLink.room.building.name} — {roomLink.room.name}
                  </Typography>

                  <Stack spacing={0.5} mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      Début :{" "}
                      {roomLink.start_at
                        ? new Date(roomLink.start_at).toLocaleDateString()
                        : "—"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fin :{" "}
                      {roomLink.end_at
                        ? new Date(roomLink.end_at).toLocaleDateString()
                        : "—"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Créée le :{" "}
                      {roomLink.created_at
                        ? new Date(roomLink.created_at).toLocaleDateString()
                        : "—"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Modifiée le :{" "}
                      {roomLink.updated_at
                        ? new Date(roomLink.updated_at).toLocaleDateString()
                        : "—"}
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
    </Box>
  );
}
