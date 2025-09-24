import { useEffect, useMemo, useState } from "react";
import { Backdrop, Box, CircularProgress, Divider, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router";

import type { Building } from "../../types/Building";
import { useAuthHeaders } from "../../hooks/useAuthHeader";
import type { RoomWithTag } from "../../types/roomWithTag";
import { useSnackbar } from "../../context/SnackbarContext";
import RoomList from "../../components/organisms/room/RoomList";
import ChangeViewRoom from "../../components/organisms/room/ChangeViewRoom";
import LateralPanelRoom from "../../components/organisms/room/LateralPanelRoom";
import RoomEdit from "../../components/organisms/room/RoomEdit";

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

const RoomEditPage = () => {
  const { id: paramId  } = useParams();
  const navigate = useNavigate();
  const { showMessage } = useSnackbar()
  const [allRooms, setAllRooms] = useState<RoomWithTag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const headers = useAuthHeaders();
  const [currentId, setCurrentId] = useState<number | undefined>(Number(paramId));
  const [room, setRoom] = useState<RoomWithTag | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [buildings, setBuildings]  = useState<Building[]>()



  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room/tag?limit=10000&with_rooms=true`,
          { headers }
        );
        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
        const data = await res.json();
        setAllRooms(data.data);
      } catch (err) {
        showMessage('Erreur lors de la récuperation des pièces', 'error')
        console.error("Erreur dans fetchAllRooms:", err);
      } finally {
        setLoading(false)
      }
    };
    fetchAllRooms();
  }, [headers, paramId]);


    useEffect(() => {
      if (allRooms.length === 0) return;

      if (!paramId) {
        const firstRoom = allRooms[0];
        setCurrentId(firstRoom.id);
        setRoom(firstRoom);
      } else {
        const id = Number(paramId);
        setCurrentId(id);

        const current = allRooms.find(r => r.id === id);
        if (current) setRoom(current);
      }
    }, [allRooms, paramId]);




  const filteredRooms = roomFilter(allRooms, {
    searchTerm,
    searchFields: ["name"],
    filters: {
      floor: floorFilter,
      building: buildingFilter,
    },
  });

  const updateRoom = (newRoom: RoomWithTag) => {
    setAllRooms(prevRooms =>
      prevRooms
        .filter((t): t is RoomWithTag => t !== undefined)
        .map(room => (room.id === newRoom.id ? newRoom : room))
    );

    setRoom(newRoom);
};

  const handleDelete = async (roomId: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/room/${roomId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setAllRooms((prev) => prev.filter((room) => room.id !== roomId));
      showMessage('Supprimé', 'success')
    } catch (err) {
      showMessage('Erreur suppression', 'error')
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <Box p={4} >
      {
        filteredRooms.length > 0 && (
          <ChangeViewRoom roomId={filteredRooms[0].id} />
        )
      }
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="flex-start"
        width="100%"
      >
        <Box minWidth="280px" width={{ xs: "100%", lg: "fit-content"}}>
          <LateralPanelRoom
            rooms={allRooms}
            buildings={buildings} 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            buildingFilter={buildingFilter}
            onBuildingFilterChange={setBuildingFilter}
            floorFilter={floorFilter}
            onFloorFilterChange={setFloorFilter}
          >
            
          <Divider variant="middle" sx={{  mt: 2, mb: 4 }}/>

          <RoomList
            rooms={filteredRooms}
            onEdit={(roomId: number) => navigate(`/room/${roomId}/edit`)}
            onDelete={handleDelete}
          />
          </LateralPanelRoom>
        </Box>

        <Box width="100%">
          <RoomEdit
            room={room} setRoom={updateRoom}
          />
          <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>

      </Stack>
    </Box>
  );
}


export default RoomEditPage