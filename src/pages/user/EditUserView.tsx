import { Box, Button, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AdminUserList from "../../components/organisms/user/DashboardUsersList";
import AdminDashboardEdit from "../../components/organisms/user/DashboardUserEdit";
import type { User } from "../../types/user";
import type { UserListItem } from "../../types/userListItem";
import { useAuthHeaders } from "../../hooks/useAuthHeader";
import { useFilter } from "../../hooks/useFilter";

const EditUserView = () => {
  const headers = useAuthHeaders();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users/${id}`,
          { headers }
        );
        if (res.status === 404) return;
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

        const data = await res.json();
        setUser({
          id: data.id,
          firstname: data.firstname ?? "",
          lastname: data.lastname ?? "",
          email: data.email ?? "",
          role: data.role ?? "guest",
          phone_number: data.phone_number ?? "",
        });
      } catch (err) {
        console.error("Erreur dans fetchUser:", err);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users`,
          { headers }
        );
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        const data = await res.json();
        setAllUsers(data.data);
      } catch (err) {
        console.error("Erreur dans fetchAllUsers:", err);
      }
    };

    fetchUser();
    fetchAllUsers();
  }, [headers, id]);

  const handleCreate = () => navigate("/user/create");

  const handleChange = (field: keyof User, value: string) => {
    if (user) setUser({ ...user, [field]: value });
  };

  const handleUpdate = async () => {
    if (!user || !id) return;

    const payload = {
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      email: user.email,
      phone_number: user.phone_number,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users/${id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert("Utilisateur mis à jour !");
      setUpdateError(null);
    } catch (err) {
      console.error("Erreur dans handleUpdate:", err);
      setUpdateError("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users/${userId}`,
        {
          method: "DELETE",
          headers,
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const filteredUsers = useFilter(allUsers, {
    searchTerm,
    searchFields: ["firstname", "lastname", "role"],
    filters: {
      role: roleFilter,
    },
  });

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={4}
      alignItems="flex-start"
    >
      <AdminUserList
        users={filteredUsers}
        onEdit={(userId) => navigate(`/admin/${userId}/edit-user`)}
        onDelete={handleDelete}
        onCreate={handleCreate}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roomFilter={roomFilter}
        onRoomFilterChange={setRoomFilter}
        roleFilter={roleFilter}
        onroleFilterChange={setRoleFilter}
      />

      <Box flex={1}>
        {updateError && (
          <Box role="alert" sx={{ color: "red", mb: 2 }}>
            {updateError}
          </Box>
        )}

        {!user ? (
          <p style={{ fontWeight: 500 }}>Chargement de l’utilisateur...</p>
        ) : (
          <>
            <Box display="flex" flexDirection="row" gap={2} mb={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "var(--dark-blue)",
                  color: "var(--light-blue)",
                }}
              >
                Vue Édition
              </Button>
              <Button
                onClick={() => navigate("/user/dashboard")}
                variant="contained"
                sx={{
                  backgroundColor: "var(--light-blue)",
                  color: "var(--dark-blue)",
                }}
              >
                Vue Tableau
              </Button>
            </Box>

            <AdminDashboardEdit
              user={user}
              onChange={handleChange}
              onUpdate={handleUpdate}
              onCancel={() => navigate(-1)}
            />
          </>
        )}
      </Box>
    </Stack>
  );
};

export default EditUserView;
