export type Room = {
  id: number;
  name: string;
  description: string;
  floor: number;
  building_id: number;
  area: number;
  shape: [number, number][];
  capacity: number;
};
