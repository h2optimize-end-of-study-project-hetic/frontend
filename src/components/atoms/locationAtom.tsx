import { atom } from "jotai";

export const locationAtom = atom<{ city: string; country: string } | null>(
  null
);
