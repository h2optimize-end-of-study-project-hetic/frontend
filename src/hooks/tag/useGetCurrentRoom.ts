import type { Tag } from "../../types/tag";
import type { TagRoom } from "../../types/tagRoom";


export const useGetCurrentRoom = (tag?: Tag, date: Date = new Date()): TagRoom | null => {
  if (!tag || !tag.rooms || tag.rooms.length === 0) {
    return null;
  }
  const now = date.getTime();
  for (const tr of tag.rooms) {
    const start = new Date(tr.start_at).getTime();
    const end = new Date(tr.end_at).getTime();

    if (now >= start && (now <= end || !end)) {
      return tr;
    }
  }

  return null;
};

