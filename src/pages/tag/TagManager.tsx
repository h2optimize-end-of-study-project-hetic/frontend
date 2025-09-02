import { useEffect, useState } from "react";
import DashboardTagList from "../../components/organisms/tag/DashboardTagList";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import type { Tag } from "../../types/tag";
import { useAuthHeaders } from "../../hooks/useAuthHeader";
import { useFilter } from "../../hooks/useFilter";

export default function TagManager() {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");

  const navigate = useNavigate();
  const headers = useAuthHeaders();

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag`,
          { headers }
        );
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        const data = await res.json();
        setAllTags(data.data);
      } catch (err) {
        console.error("Erreur dans fetchAllTags:", err);
      }
    };

    fetchAllTags();
  }, [headers]);

  const handleCreate = () => {
    navigate("/technician/create");
  };

  const handleDelete = async (tagId: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag/${tagId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setAllTags((prev) => prev.filter((tag) => tag.id !== tagId));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const filteredTags = useFilter(allTags, {
    searchTerm,
    searchFields: ["source_address", "name"],
    filters: {
      room: roomFilter,
      building: buildingFilter,
    },
  });

  return (
    <Box p={4}>
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--dark-blue)",
            color: "var(--light-blue)",
            "&:hover": {
              backgroundColor: "var(--light-blue)",
              color: "var(--dark-blue)",
            },
          }}
        >
          Vue Édition
        </Button>

        <Button
          onClick={() => navigate("/technician/dashboard")}
          variant="contained"
          sx={{
            color: "var(--dark-blue)",
            backgroundColor: "var(--light-blue)",
            "&:hover": {
              backgroundColor: "var(--dark-blue)",
              color: "var(--light-blue)",
            },
          }}
        >
          Vue tableau
        </Button>
      </Stack>

      <DashboardTagList
        tags={filteredTags}
        onEdit={(tagId) => navigate(`/technician/${tagId}/edit`)}
        onDelete={handleDelete}
        onCreate={handleCreate}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roomFilter={roomFilter}
        onRoomFilterChange={setRoomFilter}
        buildingFilter={buildingFilter}
        onBuildingFilterChange={setBuildingFilter}
      />
    </Box>
  );
}
