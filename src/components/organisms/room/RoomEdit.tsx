import { useEffect, useState } from "react";
import {
  Box, TextField, Button, Stack, Typography,
  Backdrop, CircularProgress, MenuItem,
  Divider, Dialog, DialogTitle, DialogContent,
  DialogActions
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { RoomWithTag } from "../../../types/roomWithTag";
import type { Building } from "../../../types/Building";
import { useAuthHeaders } from "../../../hooks/useAuthHeader";
import { useSnackbar } from "../../../context/SnackbarContext";
import { Add, Clear, Delete, Edit, Send } from "@mui/icons-material";

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

const TextFieldReadonly = styled(TextField)({
  '& .MuiInputBase-root.Mui-readOnly': {
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      borderWidth: '1px',
    },

    '& input, & textarea': {
      cursor: 'default',
    }
  },

  '& label.Mui-focused': {
    color: 'rgba(0, 0, 0, 0.6)',
  }
});

type RoomRequest = {
  id?: number;
  name?: string;
  description?: string;
  building_id?: number;
  floor?: number;
  capacity?: number;
  area?: number;
  start_at?: string | null;
  end_at?: string | null;
};

type TagRequest = {
  tag_id?: number;
  room_id?: number;
  start_at?: string | null;
  end_at?: string | null;
};

type Tag = {
  id: number;
  name: string;
  description?: string;
  source_address: string;
};

type Props = {
  room?: RoomWithTag;
  setRoom: (room: RoomWithTag) => void;
};

export default function RoomEdit({ room, setRoom }: Props) {
  const headers = useAuthHeaders();
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>();
  const [updatedRoom, setUpdatedRoom] = useState<RoomRequest>();
  
  // États pour la gestion des tags
  const [editingTags, setEditingTags] = useState<Record<number, boolean>>({});
  const [tagUpdates, setTagUpdates] = useState<Record<number, any>>({});
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [newTagData, setNewTagData] = useState({
    tag_id: "",
    start_at: "",
    end_at: ""
  });

  useEffect(() => {
    if (!room) return;
    setUpdatedRoom({
      id: room.id,
      name: room.name,
      description: room.description,
      building_id: room.building_id,
      floor: room.floor,
      capacity: room.capacity,
      area: room.area,
      start_at: room.start_at
        ? new Date(room.start_at).toISOString().split("T")[0]
        : null,
      end_at: room.end_at
        ? new Date(room.end_at).toISOString().split("T")[0]
        : null,
    });
  }, [room]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/building?limit=10000`,
          { headers }
        );
        if (!res.ok) throw new Error("Erreur HTTP");
        const data = await res.json();
        setBuildings(data.data);
      } catch (err) {
        showMessage("Erreur lors de la récupération des bâtiments", "error");
        console.error(err);
      }
    };
    fetchBuildings();
  }, [headers]);

  useEffect(() => {
    const fetchAvailableTags = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag?limit=10000`,
          { headers }
        );
        if (!res.ok) throw new Error("Erreur HTTP");
        const data = await res.json();
        setAvailableTags(data.data);
      } catch (err) {
        showMessage("Erreur lors de la récupération des tags", "error");
        console.error(err);
      }
    };
    fetchAvailableTags();
  }, [headers]);

  const handleChange = <K extends keyof RoomRequest>(
    field: K,
    value: RoomRequest[K]
  ) => {
    setUpdatedRoom((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };



  const handleTagChange = (tagLinkId: number, field: string, value: string) => {
    setTagUpdates(prev => ({
      ...prev,
      [tagLinkId]: {
        ...prev[tagLinkId],
        [field]: value
      }
    }));
  };

  const startEditingTag = (tagLinkId: number) => {
    const tagLink = room?.tags?.find(t => t.id === tagLinkId);
    if (tagLink) {
      setTagUpdates(prev => ({
        ...prev,
        [tagLinkId]: {
          start_at: tagLink.start_at ? new Date(tagLink.start_at).toISOString().split("T")[0] : "",
          end_at: tagLink.end_at ? new Date(tagLink.end_at).toISOString().split("T")[0] : ""
        }
      }));
      setEditingTags(prev => ({ ...prev, [tagLinkId]: true }));
    }
  };


  const cancelEditingTag = (tagLinkId: number) => {
    setEditingTags(prev => ({ ...prev, [tagLinkId]: false }));
    setTagUpdates(prev => {
      const newUpdates = { ...prev };
      delete newUpdates[tagLinkId];
      return newUpdates;
    });
  };

  const refreshRoomData = async (roomId: number) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room/tag?cursor=id=${roomId}&limit=1`,
      { headers }
    );
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    const response = await res.json();
    return response.data[0];
  };

  const submitTagUpdate = async (tagLinkId: number) => {
    if (!tagUpdates[tagLinkId]) return;

    setLoading(true);
    try {
      const payload: TagRequest = {
        start_at: tagUpdates[tagLinkId].start_at
          ? new Date(tagUpdates[tagLinkId].start_at).toISOString()
          : null,
        end_at: tagUpdates[tagLinkId].end_at
          ? new Date(tagUpdates[tagLinkId].end_at).toISOString()
          : null,
      };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room_tag/${tagLinkId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ room_tag: payload }),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (room?.id) {
        const updatedRoom = await refreshRoomData(room.id);
        setRoom(updatedRoom);
      }

      setEditingTags(prev => ({ ...prev, [tagLinkId]: false }));
      setTagUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[tagLinkId];
        return newUpdates;
      });

      showMessage("Balise mise à jour", "success");
    } catch (err) {
      showMessage("Erreur lors de la mise à jour de la balise", "error");
      console.error("Erreur dans submitTagUpdate:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeTagFromRoom = async (tagLinkId: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room_tag/${tagLinkId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (room?.id) {
        const updatedRoom = await refreshRoomData(room.id);
        setRoom(updatedRoom);
      }

      showMessage("Balise retirée de la pièce", "success");
    } catch (err) {
      showMessage("Erreur lors de la suppression de la balise", "error");
      console.error("Erreur dans removeTagFromRoom:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTagToRoom = async () => {
    if (!newTagData.tag_id || !room?.id) return;

    setLoading(true);
    try {
      const payload: TagRequest = {
        tag_id: Number(newTagData.tag_id),
        room_id: room.id,
        start_at: newTagData.start_at
          ? new Date(newTagData.start_at).toISOString()
          : null,
        end_at: newTagData.end_at
          ? new Date(newTagData.end_at).toISOString()
          : null,
      };

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room_tag`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ room_tag: payload }),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const updatedRoom = await refreshRoomData(room.id);
      setRoom(updatedRoom);

      setShowAddTagDialog(false);
      setNewTagData({ tag_id: "", start_at: "", end_at: "" });
      showMessage("Balise ajoutée à la pièce", "success");
    } catch (err) {
      showMessage("Erreur lors de l'ajout de la balise", "error");
      console.error("Erreur dans addTagToRoom:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!updatedRoom?.id) return;

    setLoading(true);

    const payload: RoomRequest = {
      name: updatedRoom.name,
      description: updatedRoom.description,
      building_id: updatedRoom.building_id,
      floor: updatedRoom.floor,
      capacity: updatedRoom.capacity,
      area: updatedRoom.area,
      start_at: updatedRoom.start_at
        ? new Date(updatedRoom.start_at).toISOString()
        : null,
      end_at: updatedRoom.end_at
        ? new Date(updatedRoom.end_at).toISOString()
        : null,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room/${updatedRoom.id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ room: payload }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const updated = await refreshRoomData(updatedRoom.id);
      setRoom(updated);
      showMessage("Salle mise à jour", "success");
    } catch (err) {
      showMessage("Erreur lors de la mise à jour", "error");
      console.error("Erreur dans handleSubmit:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (room) {
      setUpdatedRoom({
        id: room.id,
        name: room.name,
        description: room.description,
        building_id: room.building_id,
        floor: room.floor,
        capacity: room.capacity,
        area: room.area,
        start_at: room.start_at
          ? new Date(room.start_at).toISOString().split("T")[0]
          : null,
        end_at: room.end_at
          ? new Date(room.end_at).toISOString().split("T")[0]
          : null,
      });
    }
  };


  if (!room || !updatedRoom) {
    return <Typography color="text.secondary">Aucune salle sélectionnée</Typography>;
  }

  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={4}
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="100%"
    >
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <Backdrop
          sx={(theme) => ({
            color: "#fff",
            zIndex: theme.zIndex.drawer + 1,
          })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Stack spacing={3}>
          <NameTextField
            value={updatedRoom.name ?? ""}
            onChange={(e) => handleChange("name", e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <TextField
            label="Description"
            value={updatedRoom.description ?? ""}
            onChange={(e) => handleChange("description", e.target.value)}
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
              value={updatedRoom.building_id ?? ""}
              onChange={(e) =>
                handleChange(
                  "building_id",
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
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
              value={updatedRoom.floor ?? ""}
              onChange={(e) => handleChange("floor", Number(e.target.value))}
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
              value={updatedRoom.capacity ?? ""}
              onChange={(e) => handleChange("capacity", Number(e.target.value))}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Surface (m²)"
              type="number"
              value={updatedRoom.area ?? ""}
              onChange={(e) => handleChange("area", Number(e.target.value))}
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
              value={updatedRoom.start_at ?? ""}
              onChange={(e) => handleChange("start_at", e.target.value)}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            <TextField
              label="Date fin"
              type="date"
              value={updatedRoom.end_at ?? ""}
              onChange={(e) => handleChange("end_at", e.target.value)}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Stack>

          <Stack>
            <Typography color="var(--black)">
              Créée le :{" "}
              {room.created_at ? new Date(room.created_at).toLocaleDateString() : "—"}
            </Typography>
            <Typography color="var(--black)">
              Modifiée le :{" "}
              {room.updated_at ? new Date(room.updated_at).toLocaleDateString() : "—"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              type="reset"
              sx={{
                color: "var(--dark-red)",
                backgroundColor: "var(--light-red)",
                p: "6px 12px",
                borderRadius: "4px",
                fontWeight: 500,
              }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                color: "var(--dark-green)",
                backgroundColor: "var(--light-green)",
                p: "6px 12px",
                borderRadius: "4px",
                fontWeight: 500,
              }}
            >
              Éditer
            </Button>
          </Stack>
        </Stack>
      </form>

      <Divider variant="middle" sx={{ mt: 2, mb: 4 }} />
      
      <Box>
        <Typography variant="subtitle1" color="var(--black)" fontWeight={600}>
          Balises
        </Typography>

        <Button
          variant="text"
          onClick={() => setShowAddTagDialog(true)}
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
          Ajouter une balise
        </Button>

        {room.tags && room.tags.length > 0 && (
          <Stack spacing={4} sx={{ marginTop: '1rem' }}>
            {room.tags.map((tagLink) => {
              const isEditing = editingTags[tagLink.id];
              const updates = tagUpdates[tagLink.id] || {};
              
              return (
                <Stack
                  key={tagLink.id}
                  p={2}
                  border="1px solid #e0e0e0"
                  borderRadius={2}
                  spacing={2}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" width={'100%'}>
                      <TextFieldReadonly
                        label="Nom"
                        value={tagLink.tag.name ?? ''}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                        slotProps={{
                          inputLabel: { shrink: true },
                          input: {
                            style: { cursor: 'pointer' },
                            readOnly: true
                          },
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
                          width: 'fit-content'
                        }}
                      >
                        {tagLink.tag.source_address}
                      </Typography>
                    </Stack>
      
                    <TextFieldReadonly
                      label="Description"
                      value={tagLink.tag.description ?? ''}
                      fullWidth
                      multiline
                      rows={1}
                      size="small"
                      sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                      slotProps={{
                        input: {
                          style: { cursor: 'pointer' },
                          readOnly: true
                        },
                        inputLabel: { shrink: true },
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <TextFieldReadonly
                      label="Date installation dans la pièce"
                      type="date"
                      value={isEditing 
                        ? updates.start_at || ''
                        : tagLink.start_at 
                          ? new Date(tagLink.start_at).toISOString().split("T")[0]
                          : ''
                      }
                      onChange={(e) => handleTagChange(tagLink.id, "start_at", e.target.value)}
                      slotProps={{
                        input: {readOnly: !isEditing},
                        inputLabel: { shrink: true },
                      }}
                      fullWidth
                      size="small"
                    />
                    <TextFieldReadonly
                      label="Date de fin"
                      type="date"
                      value={isEditing
                        ? updates.end_at || ''
                        : tagLink.end_at
                          ? new Date(tagLink.end_at).toISOString().split("T")[0]
                          : ''
                      }
                      onChange={(e) => handleTagChange(tagLink.id, "end_at", e.target.value)}
                      slotProps={{
                        input: {readOnly: !isEditing},
                        inputLabel: { shrink: true },
                      }}
                      fullWidth
                      size="small"
                    />
                  </Stack>

                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    {!isEditing ? (
                      <>
                       <Button
                          onClick={() => startEditingTag(tagLink.id)}
                          variant="contained"
                          sx={{
                            color: "var(--dark-yellow)",
                            backgroundColor: "var(--light-yellow)",
                            p: "6px",
                            borderRadius: "40px",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.10)",
                            fontWeight: 500,
                            aspectRatio: "1 / 1",
                            minWidth: "40px",  
                          }}
                        >
                          <Edit/>
                        </Button>

                        <Button
                          onClick={() => removeTagFromRoom(tagLink.id)}
                          variant="contained"
                          sx={{
                            color: "var(--dark-red)",
                            backgroundColor: "var(--light-red)",
                            p: "6px",
                            borderRadius: "40px",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.10)",
                            fontWeight: 500,
                            aspectRatio: "1 / 1",
                            minWidth: "40px",  
                          }}
                        >
                          <Delete/>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => cancelEditingTag(tagLink.id)}
                          sx={{
                            color: "var(--dark-red)",
                            backgroundColor: "var(--light-red)",
                            p: "6px",
                            borderRadius: "40px",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.10)",
                            fontWeight: 500,
                            aspectRatio: "1 / 1",
                            minWidth: "40px",  
                          }}
                        >
                          <Clear/>
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => submitTagUpdate(tagLink.id)}
                          sx={{
                            color: "var(--dark-green)",
                            backgroundColor: "var(--light-green)",
                            p: "6px",
                            borderRadius: "40px",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.10)",
                            fontWeight: 500,
                            aspectRatio: "1 / 1",
                            minWidth: "40px",  
                          }}
                        >
                          <Send/>
                        </Button>
                      </>
                    )}
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>

      <Dialog open={showAddTagDialog} onClose={() => setShowAddTagDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pt: 4 }}>Ajouter une balise à la pièce</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Balise"
              select
              value={newTagData.tag_id}
              onChange={(e) => setNewTagData(prev => ({ ...prev, tag_id: e.target.value }))}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            >
              <MenuItem value="">Sélectionner une balise</MenuItem>
              {availableTags
                .filter(tag => !room.tags?.some(tl => tl.tag.id === tag.id))
                .map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name} ({tag.source_address})
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              label="Date installation"
              type="date"
              value={newTagData.start_at}
              onChange={(e) => setNewTagData(prev => ({ ...prev, start_at: e.target.value }))}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              label="Date de fin"
              type="date"
              value={newTagData.end_at}
              onChange={(e) => setNewTagData(prev => ({ ...prev, end_at: e.target.value }))}
              fullWidth
              size="small"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb:4 }}>
          <Button 
            onClick={() => {
              setShowAddTagDialog(false);
              setNewTagData({ tag_id: "", start_at: "", end_at: "" });
            }}
            sx={{
              color: "var(--dark-red)",
              backgroundColor: "var(--light-red)",
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={addTagToRoom}
            disabled={!newTagData.tag_id}
            sx={{
              color: "var(--dark-green)",
              backgroundColor: "var(--light-green)",
            }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}