import type { Room } from "./room";

export type TagRoom = {
  id: number;
  room: Room;
  start_at: Date;
  end_at: Date;
  created_at: Date;
  updated_at: Date;
};