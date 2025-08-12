export type Room = {
  id: string;
  name: string;
  polygon: [number, number][];
  coords: [number, number];
  type: string;
  capacity: number;
  occupied: boolean;
  temperature: number;
};

export type Etage = {
  id: string;
  name: string;
  image: string;
  bounds: [[number, number], [number, number]];
  rooms: Room[];
};

export type Building = {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]];
  etages: Etage[];
};
