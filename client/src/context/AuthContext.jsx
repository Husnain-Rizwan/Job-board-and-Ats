import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api, { clearAuthToken } from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
