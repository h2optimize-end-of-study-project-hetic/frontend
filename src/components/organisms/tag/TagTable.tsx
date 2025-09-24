import { useNavigate } from "react-router";
import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";

import type { Tag } from "../../../types/tag";
import { useGetCurrentRoom } from "../../../hooks/tag/useGetCurrentRoom";

type Props = {
  tags: Tag[];
  onDelete: (id: number) => void;
};

export default function TagTable({ tags, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <Box width="100%">
      <Box
        bgcolor="#fff"
        borderRadius={4}
        boxShadow="0 4px 12px rgba(0,0,0,0.05)"
        p={3}
        width="100%"
        overflow="auto"
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                "Nom",
                "Description",
                "Identifiant",
                "Pièce",
                "Bâtiment",
                "Éditer / Supprimer",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    color: "black",
                    textAlign: "left",
                    padding: "12px",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => {
              const room = useGetCurrentRoom(tag)?.room
              return (
                <tr key={tag.id}>
                  <td style={{ padding: "8px" }}>{tag.name || "—"}</td>
                  <td style={{ padding: "8px" }}>{tag.description || "—"}</td>
                  <td style={{ padding: "8px" }}>{tag.source_address}</td>
                  <td style={{ padding: "8px" }}>{room?.name || "—"}</td>
                  <td style={{ padding: "8px" }}>{room?.building.name || "—"}</td>
                  <td style={{ padding: "8px" }} width="100">
                    <Stack direction="row" spacing={2}>
                      <Button
                        onClick={() => navigate(`/tag/${tag.id}/edit`)}
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
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
