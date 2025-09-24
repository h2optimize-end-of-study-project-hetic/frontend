import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import { useSnackbar } from "../context/SnackbarContext";
import type { decodedJWTToken } from "../types/decodedJWTToken";

type User = {
  id: number;
  email: string;
  role: string;
};

export const useAuth = () => {
  const { showMessage } = useSnackbar()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = Boolean(user);

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

  const getUser = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      showMessage("Token manquant", "error");
      return;
    }

    try {
      const decoded: decodedJWTToken = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        showMessage("Token expiré", "error");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("User non trouvé");
      const data = await res.json();
      setUser(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur authentification");
    } finally {
      setLoading(false);  
    }
  };

  const getRole = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) {
      showMessage("Token manquant", "error");
      return null;
    }

    try {
      const decoded: decodedJWTToken = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        showMessage("Token expiré", "error");
        return null;
      }

      return decoded.role;
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération du rôle");
      showMessage("Erreur lors de la récupération du rôle", "error");
      return null;
    }
  };


  const signUp = async (firstname: string, lastname: string, email: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, password }),
      });

      if (!res.ok) throw new Error("Erreur inscription");
      if (!res.ok) throw new Error("Erreur inscription");

      await login(email, password);

    } catch (err) {
      console.error(err);
      setError("Erreur inscription");
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
    } catch (err) {
      console.error(err);
      setError("Erreur déconnexion");
    }
  };

  return { user, loading, error, login, isAuthenticated, signUp, logout, getUser, getRole};
};
