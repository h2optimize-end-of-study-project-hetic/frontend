import type { Floor } from "./floor";

export type Building = {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]];
  floors: Floor[];
};
