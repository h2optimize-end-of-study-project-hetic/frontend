import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import type { User } from "../../../types/user";

type Props = {
  users: User[];
  onDelete: (id: number) => void;
};

export default function AdminDashboardContent({ users, onDelete }: Props) {
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
          onClick={() => navigate("/admin/create")}
        >
          Créer un utilisateur
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
                "Prénom",
                "Nom",
                "Email",
                "Rôle",
                "Numéro de téléphone",
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
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: "8px" }}>{user.firstname || "—"}</td>
                <td style={{ padding: "8px" }}>{user.lastname || "—"}</td>
                <td style={{ padding: "8px" }}>{user.email}</td>
                <td style={{ padding: "8px" }}>{user.role || "—"}</td>
                <td style={{ padding: "8px" }}>{user.phone_number || "—"}</td>
                <td style={{ padding: "8px" }}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      onClick={() => navigate(`/admin/${user.id}/edit-user`)}
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
                      onClick={() => onDelete(user.id)}
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
