import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";

import type { Building } from "../../types/Building";
import { useAuthHeaders } from "../../hooks/useAuthHeader";
import type { RoomWithTag } from "../../types/roomWithTag";
import { useSnackbar } from "../../context/SnackbarContext";
import ChangeViewRoom from "../../components/organisms/room/ChangeViewRoom";
import LateralPanelRoom from "../../components/organisms/room/LateralPanelRoom";
import RoomStatistique from "../../components/organisms/room/RoomStatistique";


type FilterParams<T> = {
  searchTerm?: string;
  searchFields?: (keyof T)[];
  filters?: Partial<Record<keyof T | "building" | "floor", string>>;
};

function roomFilter(data: RoomWithTag[], params: FilterParams<RoomWithTag>) {
  const { searchTerm = "", searchFields = [], filters = {} } = params;

  const filteredData = useMemo(() => {
    return data.filter((room) => {
      const matchesSearch = searchFields.some((field) => {
        const value = String(room[field] ?? "").toLowerCase();
        return value.includes(searchTerm.toLowerCase().trim());
      });


      let matchesFloor = true;
      if (filters.floor !== undefined && filters.floor !== "") {
        matchesFloor = String(room.floor ?? "") === String(filters.floor);
      }

      let matchesBuilding = true;
      if (filters.building !== undefined && filters.building !== "") {
        matchesBuilding = String(room.building_id ?? "") === String(filters.building);
      }

      return matchesSearch && matchesBuilding && matchesFloor;
    });
  }, [data, searchTerm, searchFields, filters]);

  return filteredData;
}

const RoomStatistiquePage = () => {
  const { showMessage } = useSnackbar();
  const [allRooms, setAllRooms] = useState<RoomWithTag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const headers = useAuthHeaders();
  const [buildings, setBuildings]  = useState<Building[]>()
  
  
  useEffect(() => {
    let isMounted = true;
    const fetchJson = async <T,>(url: string): Promise<T> => {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
      return res.json();
    };

    const fetchBuildings = async () => {
      try {
        const data = await fetchJson<{ data: Building[] }>(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/building?limit=10000`
        );
        if (isMounted) setBuildings(data.data);
      } catch (err) {
        showMessage("Erreur lors de la récupération des bâtiments", "error");
        console.error(err);
      }
    };

    const fetchRooms = async () => {
      try {
        const data = await fetchJson<{ data: RoomWithTag[] }>(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room/tag?limit=100000`
        );
        if (isMounted) setAllRooms(data.data);
      } catch (err) {
        showMessage("Erreur lors de la récupération des salles", "error");
        console.error(err);
      }
    };

    fetchBuildings();
    fetchRooms();

    return () => {
      isMounted = false;
    };
  }, [headers]);

  const filteredRooms = roomFilter(allRooms, {
    searchTerm,
    searchFields: ["name"],
    filters: {
      floor: floorFilter,
      building: buildingFilter,
    },
  });

  return (
    <Box p={4}>
      {filteredRooms.length > 0 && (
        <ChangeViewRoom roomId={filteredRooms[0].id} />
      )}

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        alignItems="flex-start"
        width="100%"
      >
        <Box minWidth="280px" width={{ xs: "100%", lg: "fit-content" }}>
          <LateralPanelRoom
            rooms={allRooms}
            buildings={buildings} 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            buildingFilter={buildingFilter}
            onBuildingFilterChange={setBuildingFilter}
            floorFilter={floorFilter}
            onFloorFilterChange={setFloorFilter}
          />
        </Box>

        <Box width="100%">
          <RoomStatistique />
        </Box>
      </Stack>
    </Box>
  );
};

export default RoomStatistiquePage;
