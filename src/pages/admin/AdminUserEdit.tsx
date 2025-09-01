import { useState, useEffect } from "react";
import AdminUserList from "../../components/organisms/admin/AdminDashboardUsersList.tsx";
import type { UserListItem } from "../../types/userListItem";
import { useNavigate } from "react-router";
import { useAuthHeaders } from "../../hooks/useAuthHeader.tsx";

const AdminUserEdit = () => {
  const headers = useAuthHeaders();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users`,
          { headers }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setUsers(json.data || []);
      } catch (err) {
        console.error("Erreur fetch users:", err);
      }
    };
    fetchUsers();
  }, [headers]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      searchTerm === "" ||
      u.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    // const matchesRoom = !roomFilter || u.room === roomFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Erreur delete:", err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/${id}/edit-user`);
  };

  const handleCreate = () => {
    navigate("/admin/create");
  };

  return (
    <AdminUserList
      users={filteredUsers}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      roomFilter={roomFilter}
      onRoomFilterChange={setRoomFilter}
      roleFilter={roleFilter}
      onroleFilterChange={setRoleFilter}
    />
  );
};
export default AdminUserEdit;
