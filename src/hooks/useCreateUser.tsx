import { useState } from "react";
import { type UserInput } from "../schemas/user";

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (user: UserInput) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/v1/users", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
        
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }

      return await res.json();
    

    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur");
      console.error(err);
      return null;

    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
}
