import type { Building } from "./Building";

export type Room = {
  id: number;
  name: string;
  description: string;
  floor: number;
  building_id?: number;
  area?: number;
  shape?: [number, number][];
  capacity?: number;
  building: Building;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
};
