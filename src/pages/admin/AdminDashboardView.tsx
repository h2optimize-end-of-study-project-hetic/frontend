import { useEffect, useState } from "react";
import AdminDashboardContent from "../../components/organisms/admin/AdminDashboardContent"
import type { User } from "../../types/user";


const AdminDashboardView = () => {
    const [allUsers, setAllUsers] = useState<User[]>([]);

      useEffect(() => {
        const fetchAllUsers = async () => {
          try {
            const res = await fetch(`http://localhost:8000/api/v1/users`);
            if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
            const data = await res.json();
            setAllUsers(data.data);
          } catch (err) {
            console.error("Erreur dans fetchAllUsers:", err);
          }
        };
    
        fetchAllUsers();
      }, []);
  


  const handleDelete = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setAllUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };


  return (
    <AdminDashboardContent users={allUsers} onDelete={handleDelete}/>  
  )
}

export default AdminDashboardView