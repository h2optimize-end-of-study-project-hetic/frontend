import { useState } from "react";
import { type UserInput } from "../schemas/user";
import { useAuthHeaders } from "./useAuthHeader";

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headers = useAuthHeaders();

  const createUser = async (user: UserInput) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(user),
        }
      );

      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur");
      console.error("Erreur API :", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
}
