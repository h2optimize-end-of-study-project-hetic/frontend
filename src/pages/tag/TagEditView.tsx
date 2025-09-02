import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import DashboardEdit from "../../components/organisms/tag/DashboardTagEdit";
import DashboardTagList from "../../components/organisms/tag/DashboardTagList";
import { Box, Button, Stack } from "@mui/material";
import type { Tag } from "../../types/tag";
import { useAuthHeaders } from "../../hooks/useAuthHeader";
import { useFilter } from "../../hooks/useFilter";

export default function TagEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tag, setTag] = useState<Tag | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const headers = useAuthHeaders();

  useEffect(() => {
    if (!id) return;

    setTag(null);

    const fetchTag = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag/${id}`,
          { headers }
        );
        if (res.status === 404) return;

        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);

        const data = await res.json();
        setTag({
          ...data,
          description: data.description ?? "",
          building: data.building ?? "",
          room: data.room ?? "",
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      } catch (err) {
        console.error("Erreur dans fetchTag:", err);
      }
    };

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

    fetchTag();
    fetchAllTags();
  }, [id, headers]);

  const handleCreate = () => navigate("/technician/create");

  const handleChange = (field: keyof Tag, value: string) => {
    if (tag) setTag({ ...tag, [field]: value });
  };

  const handleUpdate = async () => {
    if (!tag) return;

    const payload = {
      description: tag.description,
      // building: tag.building,
      // room: tag.room,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag/${id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ tag: payload }),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert("Tag mis à jour bravo");
      setUpdateError(null);
    } catch (err) {
      console.error("Erreur dans handleUpdate:", err);
      setUpdateError("Erreur lors de la mise à jour");
    }
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
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={4}
      alignItems="flex-start"
    >
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

      <Box flex={1}>
        {updateError && (
          <div role="alert" style={{ color: "red", marginBottom: "1rem" }}>
            {updateError}
          </div>
        )}

        {!tag ? (
          <p style={{ fontWeight: 500 }}>Chargement de la balise...</p>
        ) : (
          <>
            <Box display="flex" flexDirection="row" gap={2} mb={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "var(--dark-blue)",
                  color: "var(--light-blue)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
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
            </Box>

            <DashboardEdit
              tag={tag}
              onChange={handleChange}
              onUpdate={handleUpdate}
              onCancel={() => window.history.back()}
            />
          </>
        )}
      </Box>
    </Stack>
  );
}
