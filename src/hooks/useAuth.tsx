import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  role: string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //QUAND LE BACKEND EST EN PLACE

  // const login = async (email: string, password: string) => {
  //   try {
  //     const response = await fetch("/api/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Échec de la connexion");
  //     }

  //     const data = await response.json();
  //     localStorage.setItem("token", data.token);
  //     setUser(data.user);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Erreur de connexion");
  //   }
  // };

  const login = async (email: string, password: string) => {
    void password;
  try {
    await new Promise((res) => setTimeout(res, 500));

    const fakeToken = "123456";
    const fakeUser = {
      id: 1,
      email,
      role: "admin",
    };

    localStorage.setItem("token", fakeToken);
    setUser(fakeUser);
    console.log("Mock login réussi !");
  } catch (err) {
    console.error(err);
    setError("Erreur de connexion (mock)");
  }
};

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          signal,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Impossible de charger l'utilisateur");
        }

        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        const error = err as Error;
        if (error.name !== "AbortError") {
          setError(error.message || "Erreur inconnue");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      controller.abort();
    };
  }, []);

  return { user, loading, error, login };
};
