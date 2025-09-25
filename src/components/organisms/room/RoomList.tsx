import { Box, Typography, Button, Stack } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import type { Building } from "../../../types/Building";
import type { RoomWithTag } from "../../../types/roomWithTag";


type Props = {
  rooms: RoomWithTag[];
  buildings?: Building[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function RoomList({
  rooms,
  onEdit,
  onDelete,
  buildings
}: Props) {
  return (
    <Stack gap={2}
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(232px, 300px))"
      justifyContent="center"
    >
      {
        rooms.map((room) => {


          return (
            <Box
              key={room.id}
              bgcolor="var(--lightest-grey)"
              p={2}
              borderRadius={2}
              boxShadow='0 2px 4px rgba(0, 0, 0, 0.15)'
            >
              <Stack direction="row" spacing={1} mt={1} justifyContent="space-between" alignItems="center" width={'100%'}>
                <Typography variant="subtitle1" fontWeight={600} noWrap sx={{minWidth: "50px", overflow: "hidden", textOverflow: "ellipsis"}}>
                  {room.name}
                </Typography>
              </Stack>

              {room && (
                <Stack direction="row" spacing={1} mt={1} justifyContent="space-between" alignItems="center" width={'100%'}>
                  <Box>
                    {
                      room.building_id
                      ? buildings?.find((building) => building.id === room.building_id)?.name || "—"
                      : "—"
                    }
                  </Box>
                  <Box>
                    {(room.floor || room.floor === 0) ? (room.floor === 0 ? "RDC" : room.floor ):  ""}
                  </Box>
                </Stack>
              )}
            
              <Stack
                direction="row"
                spacing={2}
                mt={2}
                justifyContent="flex-end"
              >
                <Button
                  onClick={() => onEdit(room.id)}
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
                  onClick={() => onDelete(room.id)}
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
              </Stack>
            </Box>
          )
        })
      }
    </Stack>
  );
}
