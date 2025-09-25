import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";

import type { Tag } from "../../types/tag";
import { useAuthHeaders } from "../../hooks/useAuthHeader";
import { useSnackbar } from "../../context/SnackbarContext";
import TagTable from "../../components/organisms/tag/TagTable";
import ChangeView from "../../components/organisms/tag/ChangeView";
import LateralPanel from "../../components/organisms/tag/LateralPanel";

type FilterParams<T> = {
  searchTerm?: string;
  searchFields?: (keyof T)[];
  filters?: Partial<Record<keyof T | "room" | "building", string>>;
};

function tagFilter(
  data: Tag[],
  params: FilterParams<Tag>
) {
  const { searchTerm = "", searchFields = [], filters = {} } = params;

  const filteredData = useMemo(() => {
    return data.filter((tag) => {
      const matchesSearch = searchFields.some((field) => {
        const value = String(tag[field] ?? "").toLowerCase();
        return value.includes(searchTerm.toLowerCase().trim());
      });

      let matchesRoom = true;
      if (filters.room && filters.room !== "") {
        matchesRoom =
          tag.rooms?.some((r) => r.room?.name === filters.room) ?? false;
      }

      let matchesBuilding = true;
      if (filters.building && filters.building !== "") {
        matchesBuilding =
          tag.rooms?.some(
            (r) => r.room?.building?.name === filters.building
          ) ?? false;
      }

      return matchesSearch && matchesRoom && matchesBuilding;
    });
  }, [data, searchTerm, searchFields, filters]);

  return filteredData;
}


const TagExplorerPage = () => {
  const { showMessage } = useSnackbar()
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const headers = useAuthHeaders();

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag?limit=10000&with_rooms=true`,
          { headers }
        );
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        const data = await res.json();
        setAllTags(data.data);
      } catch (err) {
        showMessage('Erreur lors de la récupération des balises', 'error')
        console.error("Erreur dans fetchAllTags:", err);
      }
    };

    fetchAllTags();

  }, [headers]);
  
  const filteredTags = tagFilter(allTags, {
    searchTerm,
    searchFields: ["source_address", "name"],
    filters: {
      rooms: roomFilter,
      building: buildingFilter,
    },
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
      showMessage('Supprimé', 'success')
    } catch (err) {
      showMessage('Erreur suppression', 'error')
      console.error("Erreur lors de la suppression :", err);
    }
  };


  return (
    <Box p={4}>
      {
        filteredTags.length > 0 && (
          <ChangeView tagId={filteredTags[0].id} />
        )
      }
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        alignItems="flex-start"
        width="100%"
      >
        <Box minWidth="280px" width={{ xs: "100%", lg: "fit-content"}}>
          <LateralPanel
            tags={filteredTags}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roomFilter={roomFilter}
            onRoomFilterChange={setRoomFilter}
            buildingFilter={buildingFilter}
            onBuildingFilterChange={setBuildingFilter}
          />
        </Box>

        <Box width="100%">
          <TagTable  tags={filteredTags} onDelete={handleDelete} />
        </Box>

      </Stack>
    </Box>
  );
}


export default TagExplorerPage