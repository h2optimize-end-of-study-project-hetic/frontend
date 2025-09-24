import type { Building } from "./Building";
import type { roomTag } from "./roomTag";

export type RoomWithTag = {
  id: number;
  name: string;
  description: string;
  building_id: number;
  building: Building;
  start_at: string;
  end_at: string;
  floor: number;
  created_at?: Date;
  updated_at?: Date;
  tags?: roomTag[];
  shape?: []; 
  capacity?: number
  area?: number
};