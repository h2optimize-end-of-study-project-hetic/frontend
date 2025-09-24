import type { TagRoom } from "./tagRoom";

export type Tag = {
  name: string;
  id: number;
  source_address: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  rooms?: TagRoom[];
};


