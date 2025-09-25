import { useEffect, useMemo, useState } from "react";
import { Backdrop, Box, CircularProgress, Divider, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router";

import type { Tag } from "../../types/tag";
import { useAuthHeaders } from "../../hooks/useAuthHeader";
import { useSnackbar } from "../../context/SnackbarContext";
import TagList from "../../components/organisms/tag/TagList";
import TagEdit from "../../components/organisms/tag/TagEdit";
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


const TagEditPage = () => {
  const { id: paramId  } = useParams();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar()
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const headers = useAuthHeaders();
  const [currentId, setCurrentId] = useState<number | undefined>(Number(paramId));
  const [tag, setTag] = useState<Tag | undefined>(undefined);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/tag?limit=10000&with_rooms=true`,
          { headers }
        );
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        const data = await res.json();
        setAllTags(data.data);
      } catch (err) {
        showMessage('Erreur lors de la récuperation des balises', 'error')
        console.error("Erreur dans fetchAllTags:", err);
      } finally {
        setLoading(false)
      }
    };
    fetchAllTags();
  }, [headers, paramId]);


  useEffect(() => {
    if (allTags.length === 0) return;

    if (!paramId) {
      const first = allTags[0];
      setCurrentId(first.id);
      setTag(first);
    } else {
      const id = Number(paramId);
      setCurrentId(id);
      const current = allTags.find(t => t.id === id);
      if (current) setTag(current);
    }
  }, [allTags, paramId]);


  const filteredTags = tagFilter(allTags, {
    searchTerm,
    searchFields: ["source_address", "name"],
    filters: {
      room: roomFilter,
      building: buildingFilter,
    },
  });

  const updateTag = (newTag: Tag) => {
    setAllTags(prevTags =>
      prevTags
        .filter((t): t is Tag => t !== undefined)
        .map(tag => (tag.id === newTag.id ? newTag : tag))
    );

    setTag(newTag);
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
      showMessage('Supprimé', 'success')
    } catch (err) {
      showMessage('Erreur suppression', 'error')
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <Box p={4} >
      {
        filteredTags.length > 0 && (
          <ChangeView tagId={filteredTags[0].id} />
        )
      }
      <Stack
        direction={{ xs: "column", md: "row" }}
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
          >
            
          <Divider variant="middle" sx={{  mt: 2, mb: 4 }}/>

          <TagList
            tags={filteredTags}
            onEdit={(tagId: number) => navigate(`/tag/${tagId}/edit`)}
            onDelete={handleDelete}
          />
          </LateralPanel>
        </Box>

        <Box width="100%">
          <TagEdit
            tag={tag} setTag={updateTag}
          />
          <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>

      </Stack>
    </Box>
  );
}


export default TagEditPage