import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  role: string;
  username: string;
  lastname: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = import.meta.env.VITE_API_BASE ?? ''

  const login = async (email: string, password: string) => {
    try {
        const res = await fetch(`${API}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ username: email, password }),
        });
        if (!res.ok) throw new Error("Échec de la connexion");
        const data = await res.json(); // { access_token, token_type }
        localStorage.setItem("token", data.access_token);
        // option: récupérer l'utilisateur tout de suite
        const me = await fetch(`${API}/api/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        if (me.ok) {
          const user = await me.json();
          setUser(user);
        }
        setError(null);
      } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Erreur: ${message}`);
    }
  };

  // Chargement de l'utilisateur au démarrage si token existe
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetch(`${API}/api/me`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token invalide ou expiré");
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { user, loading, error, login };
};
