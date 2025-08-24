export type Room = {
  id: string;
  name: string;
  polygon: [number, number][];
  coords: [number, number];
  //   type: string;
  capacity: number;
  occupied: boolean;
  temperature: number;
};
