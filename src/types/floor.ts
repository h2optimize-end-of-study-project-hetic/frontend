import type { Room } from "./room";

export type Floor = {
  id: string;
  name: string;
  image: string;
  bounds: [[number, number], [number, number]];
  rooms: Room[];
};
