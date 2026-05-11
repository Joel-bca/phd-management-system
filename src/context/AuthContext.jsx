/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) return { 
      name: localStorage.getItem("name"), 
      role: localStorage.getItem("role"),
      id: localStorage.getItem("id"),
      is_hod: localStorage.getItem("is_hod") === "true",
      is_coordinator: localStorage.getItem("is_coordinator") === "true"
    };
    return null;
  });

  const login = (userData) => setUser(userData);
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);