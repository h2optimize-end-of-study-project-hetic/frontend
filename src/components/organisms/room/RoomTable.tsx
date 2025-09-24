import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { Box, Button, Stack } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import type { RoomWithTag } from "../../../types/roomWithTag";
import { useAuthHeaders } from "../../../hooks/useAuthHeader";
import { useSnackbar } from "../../../context/SnackbarContext";
import type { Building } from "../../../types/Building";

type Props = {
  rooms: RoomWithTag[];
  onDelete?: (id: number) => void;
  buildings?: Building[]
};

export default function RoomTable({ rooms, onDelete, buildings }: Props) {
  const navigate = useNavigate();
  const headers = useAuthHeaders();
  const { showMessage } = useSnackbar()

  const handleDelete = async (id: number) => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      showMessage("Supprimée", "success");
      if (onDelete) {
        onDelete(id);
      }
    } catch (err) {
      showMessage("Erreur suppression", "error");
      console.error(err);
    }
  };


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
                "Bâtiment",
                "Étage",
                "Capacité",
                "Taille",
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
            {rooms.map((room) => (
              <tr key={room.id}>
                <td style={{ padding: "8px" }}>{room.name || "—"}</td>
                <td style={{ padding: "8px" }}>{room.description || "—"}</td>
                <td style={{ padding: "8px" }}>
                  {room.building_id
                    ? buildings?.find((building) => building.id === room.building_id)?.name || "—"
                    : "—"}
                </td>                
                <td style={{ padding: "8px" }}>{(room.floor || room.floor === 0) ? (room.floor === 0 ? "RDC" : room.floor ):  "—"}</td>
                <td style={{ padding: "8px" }}>{room.capacity ?? "—"}</td>
                <td style={{ padding: "8px" }}>{room.area ?? "—"}</td>

                <td style={{ padding: "8px" }} width="100">
                  <Stack direction="row" spacing={2}>
                    <Button
                      onClick={() => navigate(`/room/${room.id}/edit`)}
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
                      <Edit />
                    </Button>

                    <Button
                      onClick={() => handleDelete(room.id)}
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
                      <Delete />
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