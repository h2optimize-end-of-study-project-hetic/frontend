import { useParams } from "react-router";
import { useEffect, useState } from "react";
import DashboardEdit from "../../components/organisms/technician/DashboardEdit";
import DashboardTagList from "../../components/organisms/technician/DashboardTagList";
import { Box, Stack } from "@mui/material";

type Tag = {
  id: number;
  source_address: string;
  description: string;
  building: string;
  room: string;
  installedAt: string;
  removedAt: string;
  createdAt: string;
  updatedAt: string;
};

export default function DashboardTagEdit() {
  const { id } = useParams();
  const [tag, setTag] = useState<Tag | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/tag/${id}`);
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
      const res = await fetch(`http://localhost:8000/api/v1/tag`);
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
      const data = await res.json();
      setAllTags(data.data);
    } catch (err) {
      console.error("Erreur dans fetchAllTags:", err);
    }
  };

  fetchTag();
  fetchAllTags();
}, [id]);

  

  const handleChange = (field: keyof Tag, value: string) => {
    if (tag) setTag({ ...tag, [field]: value });
  };

  const handleUpdate = async () => {
    if (!tag) return;

    const payload = {
      description: tag.description,
      building: tag.building,
      room: tag.room,
    };

    try {
      const res = await fetch(`http://localhost:8000/api/v1/tag/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: payload }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert("Tag mis à jour bravo");
      setUpdateError(null);
    } catch (err) {
      console.error("Erreur dans handleUpdate:", err);
      setUpdateError("Erreur lors de la mise à jour");
    }
  };

  if (!tag) return <div>Chargement...</div>;

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={4}
      alignItems="flex-start"
    >
    <DashboardTagList
      tags={allTags}
      onEdit={(id) => window.location.href = `/release/technician/${id}/edit`}
    />

    <Box flex={1}>
      {updateError && (
        <div role="alert" style={{ color: "red" }}>
          {updateError}
        </div>
      )}
      <DashboardEdit
        tag={tag}
        onChange={handleChange}
        onUpdate={handleUpdate}
        onCancel={() => window.history.back()}
      />
    </Box>
  </Stack>
  );
}
