import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type User = {
  id: number;
  email: string;
  role: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = Boolean(user);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const data = new URLSearchParams();
      data.append("grant_type", "password");
      data.append("username", username);
      data.append("password", password);
      data.append("scope", "");
      data.append("client_id", "string");
      data.append("client_secret", "**");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: data,
        }
      );

      if (!res.ok) throw new Error("Erreur Auth");
      const body = await res.json();

      localStorage.setItem("token", body.access_token);

      setUser(body.user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion");
      throw err;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("User non trouvé");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Erreur authentification");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signUp = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstname, lastname, email, password }),
        }
      );

      if (!res.ok) throw new Error("Erreur inscription");

      await login(email, password);
    } catch (err) {
      console.error(err);
      setError("Erreur inscription");
    }
  };

  return { user, loading, error, login, isAuthenticated, signUp };
};
