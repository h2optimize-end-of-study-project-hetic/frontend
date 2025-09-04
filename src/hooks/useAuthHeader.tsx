import { useMemo } from "react";

export const useAuthHeaders = () => {
  return useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);
};
