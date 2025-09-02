import { useEffect, useState } from "react";
import AdminDashboardContent from "../../components/organisms/user/DashboardUserContent";
import type { User } from "../../types/user";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuthHeaders } from "../../hooks/useAuthHeader";

const AdminDashboardView = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const headers = useAuthHeaders();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users`,
          {
            headers,
          }
        );
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        const data = await res.json();
        setAllUsers(data.data);
      } catch (err) {
        console.error("Erreur dans fetchAllUsers:", err);
      }
    };

    fetchAllUsers();
  }, [headers]);

  const handleDelete = async (userId: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users/${userId}`,
        {
          headers,
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setAllUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <>
      <Box p={4}>
        <Box display="flex" flexDirection="row" gap={2} mb={2} maxWidth={320}>
          <Button
            onClick={() => navigate("/admin/edit")}
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
            onClick={() => navigate("/admin/dashboard")}
            variant="contained"
            sx={{
              color: "var(--light-blue)",
              backgroundColor: "var(--dark-blue)",
              "&:hover": {
                backgroundColor: "var(--light-blue)",
                color: "var(--dark-blue)",
              },
            }}
          >
            Vue tableau
          </Button>
        </Box>
      </Box>
      <AdminDashboardContent users={allUsers} onDelete={handleDelete} />
    </>
  );
};

export default AdminDashboardView;
