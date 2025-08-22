import { useEffect, useState } from "react";
import DashboardEdit from "../../components/organisms/technician/DashboardEdit";
import { Box } from "@mui/material";
import type { Tag } from "../../types/tag";
import type { TagCreatePayload } from "../../types/tagCreatePayload";

export default function TechnicianTagCreate() {
  const [tag, setTag] = useState<Tag | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaxId = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/tag");
        if (!res.ok) throw new Error("Erreur lors du fetch");

        const data = await res.json();
        const tags: Tag[] = data.data;

        const maxId = Math.max(...tags.map((t) => t.id || 0));
        const nextId = maxId + 1;

        setTag({
          id: nextId,
          source_address: "",
          description: "",
          building: "",
          room: "",
          installedAt: "",
          removedAt: "",
          createdAt: "",
          updatedAt: "",
        });
      } catch (err) {
        console.error("Erreur fetch ID max:", err);
      }
    };

    fetchMaxId();
  }, []);

  const handleChange = (field: keyof Tag, value: string) => {
    if (tag) {
      setTag((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleCreate = async () => {
    if (!tag) return;
    const payload: TagCreatePayload = {
      name: tag.source_address,
      source_address: tag.source_address,
      description: tag.description,
    };

    try {
      const res = await fetch(`http://localhost:8000/api/v1/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert("Balise créée !");
      window.location.href = "/technician";
    } catch (err) {
      console.error("Erreur dans handleCreate:", err);
      setCreateError("Erreur lors de la création");
    }
  };

  if (!tag) return <p>Chargement...</p>;

  return (
    <Box p={4}>
      {createError && <div style={{ color: "red" }}>{createError}</div>}

      <DashboardEdit
        tag={tag}
        onChange={handleChange}
        onUpdate={handleCreate}
        onCancel={() => window.history.back()}
      />
    </Box>
  );
}
