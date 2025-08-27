import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import type { Tag } from "../../../types/tag";

type Props = {
  tags: Tag[];
  onDelete: (id: number) => void;
};

export default function DashboardContent({ tags, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <Box p={4} width="100%">
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        mb={4}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--light-green)",
            color: "var(--dark-green)",
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
          onClick={() => navigate("/technician/create")}
        >
          Créer une balise
        </Button>
      </Stack>

      <Box
        bgcolor="#fff"
        borderRadius={4}
        boxShadow="0 4px 12px rgba(0,0,0,0.05)"
        p={3}
        minHeight="300px"
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
                "État",
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
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td style={{ padding: "8px" }}>{tag.name || "—"}</td>
                <td style={{ padding: "8px" }}>{tag.description || "—"}</td>
                <td style={{ padding: "8px" }}>{tag.source_address}</td>
                <td style={{ padding: "8px" }}>{tag.room || "—"}</td>
                <td style={{ padding: "8px" }}>{tag.building || "—"}</td>
                <td style={{ padding: "8px" }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      onClick={() => navigate(`/technician/${tag.id}/edit`)}
                      variant="contained"
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
                    <Button
                      onClick={() => onDelete(tag.id)}
                      variant="contained"
                      sx={{
                        color: "var(--dark-red)",
                        backgroundColor: "var(--light-red)",
                        p: "6px 12px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.10)",
                        fontWeight: 500,
                      }}
                    >
                      Supprimer
                    </Button>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
