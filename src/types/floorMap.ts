export interface FloorMap {
  id: number;
  building_id: number;
  file_name: string;
  floor: number;
  path: string;
  width: number;
  length: number;
  created_at: string;
  updated_at: string | null;
}
