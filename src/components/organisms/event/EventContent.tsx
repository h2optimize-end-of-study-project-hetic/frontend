import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { formatEventTime } from "../../../utils/date";
import type { EventsByDate } from "../../../types/eventsByDate";
import { useEffect, useState } from "react";
import type { Room } from "../../../types/room";
import { useDeleteEventRoom } from "../../../hooks/useEvents";

type Props = {
  eventsByDate: EventsByDate[] | null;
  setEventsByDate: React.Dispatch<React.SetStateAction<EventsByDate[] | null>>;
  selectedRooms: Room[];
  selectedFloorId: number | null;
  selectedBuildingId: number | null;
};

export function EventContent({
  eventsByDate,
  setEventsByDate,
  selectedRooms,
  selectedFloorId,
  selectedBuildingId,
}: Props) {
  const { deleteEventRoom } = useDeleteEventRoom();

  const [selectedRoomName, setSelectedRoomName] = useState<string>("");

  const filteredEvents =
    eventsByDate
      ?.filter((event) => {
        // Si un filtre de salle est choisi, ne garder que les events de cette salle
        if (selectedRoomName) {
          const room = selectedRooms.find((r) => r.id === event.room_id);
          return room?.name === selectedRoomName;
        }
        // Sinon, ne garder que les events dont la room_id correspond à une salle du floor/bâtiment sélectionné
        return selectedRooms.some((r) => r.id === event.room_id);
      })
      .sort(
        (a, b) =>
          new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      ) ?? [];

  useEffect(() => {
    // à chaque changement de floor ou building
    setSelectedRoomName(""); // reset le filtre du select
  }, [selectedFloorId, selectedBuildingId]);

  const handleDelete = async (event_room_id: number) => {
    const success = await deleteEventRoom(event_room_id);
    if (success) {
      // retire l'event de la liste sans re-fetch

      setEventsByDate((prev) =>
        prev ? prev.filter((e) => e.id !== event_room_id) : []
      );

      console.log("bye");
    } else {
      alert("Impossible de supprimer l'événement");
    }
  };

  return (
    <Box
      padding={3}
      bgcolor="#fff"
      borderRadius={3}
      width="100%"
      maxWidth="350px"
      height="70vh"
      overflow="auto"
      border="1px solid var(--light-blue)"
    >
      <Stack spacing={2} color="black">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">Liste des évènements</Typography>

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
              },
            }}
            // onClick={() => onCreate() }
          >
            +
          </Button>
        </Stack>
        {/* <TextField
                placeholder="Rechercher"
                fullWidth
                value={searchTerm}
                onChange={(e) => e.target.value}
              /> */}

        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Toutes les salles"
            fullWidth
            value={selectedRoomName || ""}
            onChange={(e) => setSelectedRoomName(e.target.value)}
          >
            <MenuItem value="">Toutes les salles</MenuItem>

            {selectedRooms &&
              selectedRooms.length > 0 &&
              selectedRooms.map((roomList) => (
                <MenuItem key={roomList.id} value={roomList.name ?? ""}>
                  {roomList.name}
                </MenuItem>
              ))}
          </TextField>
        </Stack>

        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const room = selectedRooms.find((r) => r.id === event.room_id);
            const roomName = room?.name ?? "Salle inconnue";

            return (
              <Box
                key={event.room_id}
                bgcolor="var(--lightest-grey)"
                p={2}
                borderRadius={2}
              >
                <Typography fontWeight={600}>{event.event_name}</Typography>
                <p>{formatEventTime(event.start_at, event.end_at)}</p>
                <p className="text-xs">{event.description}</p>
                <Stack
                  direction="row"
                  mt={1}
                  flexWrap="wrap"
                  alignItems="flex-start"
                  gap={1}
                >
                  <Box
                    bgcolor="var(--light-green)"
                    px={2}
                    py={0.5}
                    borderRadius={2}
                    boxShadow="0px 2px 4px rgba(0,0,0,0.1)"
                  >
                    {event.group_name}
                  </Box>
                  <Box
                    bgcolor="var(--light-blue)"
                    px={2}
                    py={0.5}
                    borderRadius={2}
                    boxShadow="0px 2px 4px rgba(0,0,0,0.1)"
                  >
                    {roomName}
                  </Box>
                </Stack>
                <p className="text-xs !mt-2.5">
                  Professeur : {event.supervisor}
                  <br />
                  Nombre d'élèves : {event.member_count}
                </p>
                <Stack
                  direction="row"
                  spacing={2}
                  mt={2}
                  justifyContent="space-between"
                >
                  <Button
                    // onClick={() => onDelete(user.id)}
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--light-red)",
                      color: "var(--dark-red)",
                    }}
                    onClick={() => handleDelete(event.id)}
                  >
                    Supprimer
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--light-green)",
                      color: "var(--dark-green)",
                    }}
                    // onClick={() => onEdit(user.id)}
                  >
                    Éditer
                  </Button>
                </Stack>
              </Box>
            );
          })
        ) : (
          <p className="text-red-500">
            Pas d'évènement disponible à cette date ou à cette étage
          </p>
        )}
      </Stack>
    </Box>
  );
}
