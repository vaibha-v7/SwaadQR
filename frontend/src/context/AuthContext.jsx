import { useState, useEffect } from "react";
import api from "../api/axios";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [owner, setOwner] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/swaad/owner/profile");
      setOwner(data.owner);
      setRestaurants(data.restaurants || []);
    } catch {
      setOwner(null);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/swaad/owner/login", { email, password });
    setOwner(data.owner);
    await fetchProfile();
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/swaad/owner/profile", payload);
    setOwner(data.owner);
    setRestaurants((prev) => prev);
    return data;
  };

  const logout = async () => {
    await api.post("/swaad/owner/logout");
    setOwner(null);
    setRestaurants([]);
  };

  return (
    <AuthContext.Provider
      value={{ owner, restaurants, setRestaurants, loading, login, logout, updateProfile, isAuthenticated: !!owner, fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
