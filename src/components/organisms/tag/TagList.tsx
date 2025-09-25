import { Delete, Edit } from "@mui/icons-material";
import { Box, Typography, Button, Stack } from "@mui/material";

import type { Tag } from "../../../types/tag";
import { useGetCurrentRoom } from "../../../hooks/tag/useGetCurrentRoom";

type Props = {
  tags: Tag[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TagList({
  tags,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Stack gap={2}
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(232px, 300px))"
      justifyContent="center"
    >
      {
        tags.map((tag) => {
          const room = useGetCurrentRoom(tag)?.room
          
          return (
            <Box
              key={tag.id}
              bgcolor="var(--lightest-grey)"
              p={2}
              borderRadius={2}
              boxShadow='0 2px 4px rgba(0, 0, 0, 0.15)'
            >
              <Stack direction="row" spacing={1} mt={1} justifyContent="space-between" alignItems="center" width={'100%'}>
                <Typography variant="subtitle1" fontWeight={600} noWrap sx={{minWidth: "50px", overflow: "hidden", textOverflow: "ellipsis"}}>
                  {tag.name}
                </Typography>

                <Typography variant="subtitle2" noWrap sx={{minWidth: "50px", overflow: "hidden", textOverflow: "clip"}}>
                  {tag.source_address}
                </Typography>
              </Stack>

              {room && (
                <Stack direction="row" spacing={1} mt={1} justifyContent="space-between" alignItems="center" width={'100%'}>
                  <Box>
                    {room.building.name}
                  </Box>
                  <Box>
                    {room.name}
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
                  onClick={() => onEdit(tag.id)}
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
                  onClick={() => onDelete(tag.id)}
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
