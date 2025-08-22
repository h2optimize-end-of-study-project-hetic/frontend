import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import type { Tag } from "../../../types/tag";
export default function DashboardContent() {
  const navigate = useNavigate();
  const [tags, setTag] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/tag");
        if (!res.ok) throw new Error("Erreur dans le fetch des tags");
        const data = await res.json();
        setTag(data.data)
      }
      catch (err) {
        console.error("Erreur fetch tags :", err);
      }
    }
    fetchTags();

  }, [])

  return (
    <Box p={4} width="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => navigate(`/technician/edit`)}
            variant="contained"
            sx={{
              backgroundColor: "var(--light-blue)",
              color: "var(--dark-blue)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "var(--dark-blue)",
                color: "var(--light-blue)",
              },
            }}
          >
            Vue Édition
          </Button>

          <Button
            onClick={() => navigate("/technician/dashboard")}
            variant="contained"
            sx={{
              backgroundColor: "var(--dark-blue)",
              color: "var(--light-blue)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "var(--light-blue)",
                color: "var(--dark-blue)"
              },
            }}
          >
            Vue tableau
          </Button>
        </Stack>

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
          Ajouter / créer une balise
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
              {["Nom", "Description", "Identifiant", "Pièce", "Bâtiment", "État", "Éditer / supprimer"].map((title) => (
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
                <td style={{ padding: "8px" }}>—</td>
                <td style={{ padding: "8px" }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "var(--light-green)",
                        color: "var(--dark-green)",
                        fontWeight: 500,
                        padding: "4px 8px",
                      }}
                      onClick={() => navigate(`/technician/${tag.id}/edit`)}
                    >
                      éditer
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "var(--light-red)",
                        color: "var(--dark-red)",
                        fontWeight: 500,
                        padding: "4px 8px",
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
