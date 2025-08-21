import { useParams } from "react-router";
import { useEffect, useState } from "react";
import DashboardEdit from "../../components/organisms/technician/DashboardEdit.tsx";

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

export default function TechnicianTagEdit() {
  const { id } = useParams();
  const [tag, setTag] = useState<Tag | null>(null);

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
          installedAt: data.installedAt ?? "",
          removedAt: data.removedAt ?? "",
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      } catch (err) {
        console.error("Erreur dans fetchTag:", err);
      }
    };
    fetchTag();
  }, [id]);

  const handleChange = (field: keyof Tag, value: string) => {
    if (tag) setTag({ ...tag, [field]: value });
  };

  const handleUpdate = async () => {
    if (!tag) return;

    await fetch(`http://localhost:8000/api/v1/tag/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tag),
    });

    alert("Tag mise à jour !");
  };

  if (!tag) return <div>Chargement...</div>;

  return (
    <DashboardEdit
      tag={tag}
      onChange={handleChange}
      onUpdate={handleUpdate}
      onCancel={() => window.history.back()}
    />
  );
}
