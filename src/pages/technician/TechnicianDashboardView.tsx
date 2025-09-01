import { Box, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import DashboardContent from "../../components/organisms/technician/DashboardContent";
import FilerTagList from "../../components/organisms/technician/FilterTagList";
import type { Tag } from "../../types/tag";
import { useEffect, useState } from "react";
import { useAuthHeaders } from "../../hooks/useAuthHeader";

export default function TechnicianDashboard() {
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

  const filteredTags = allTags.filter((tag) => {
    const matchesSearch = tag.source_address
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRoom = roomFilter === "" || tag.room === roomFilter;
    const matchesBuilding =
      buildingFilter === "" || tag.building === buildingFilter;
    return matchesSearch && matchesRoom && matchesBuilding;
  });

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

  return (
    <Box p={4}>
      <Box display="flex" flexDirection="row" gap={2} mb={2} maxWidth={320}>
        <Button
          onClick={() => navigate("/technician/edit")}
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
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="flex-start"
        width="100%"
      >
        <Box maxWidth="390px" minWidth="340px" flexShrink={0} paddingTop={4}>
          <FilerTagList
            tags={filteredTags}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roomFilter={roomFilter}
            onRoomFilterChange={setRoomFilter}
            buildingFilter={buildingFilter}
            onBuildingFilterChange={setBuildingFilter}
          />
        </Box>

        <Box flex={1}>
          <DashboardContent tags={filteredTags} onDelete={handleDelete} />
        </Box>
      </Stack>
    </Box>
  );
}
