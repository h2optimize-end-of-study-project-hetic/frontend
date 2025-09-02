import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import type { Tag } from "../../types/tag";
import type { TagCreatePayload } from "../../types/tagCreatePayload";
import { useNavigate } from "react-router";
import DashboardCreate from "../../components/organisms/tag/DashboardTagCreate";
import { useAuthHeaders } from "../../hooks/useAuthHeader";

export default function TagCreate() {
  const [tag, setTag] = useState<Tag | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const navigate = useNavigate();
  const headers = useAuthHeaders();

  useEffect(() => {
    const fetchMaxId = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag`,
          { headers }
        );
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
          name: "",
        });
      } catch (err) {
        console.error("Erreur fetch ID max:", err);
      }
    };

    fetchMaxId();
  }, [headers]);

  const handleChange = (field: keyof Tag, value: string) => {
    if (tag) {
      setTag((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleCreate = async () => {
    if (!tag) return;

    const payload: TagCreatePayload = {
      name: tag.name,
      source_address: tag.source_address,
      description: tag.description ?? "",
    };
    console.log("Payload envoyé :", JSON.stringify({ tag: payload }, null, 2));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ tag: payload }),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      alert("Balise créée !");
      navigate("/technician/dashboard");
    } catch (err) {
      console.error("Erreur dans handleCreate:", err);
      setCreateError("Erreur lors de la création");
    }
  };

  if (!tag) return <p>Chargement...</p>;

  return (
    <Box p={4}>
      {createError && <div style={{ color: "red" }}>{createError}</div>}
      <Button
        onClick={() => navigate("/technician/dashboard")}
        variant="contained"
        sx={{
          padding: 1,
          marginBottom: 2,
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
      <DashboardCreate
        tag={tag}
        onChange={handleChange}
        onCreate={handleCreate}
        onCancel={() => window.history.back()}
      />
    </Box>
  );
}
