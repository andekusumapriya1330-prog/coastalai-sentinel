import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("coastalai_session");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (session) localStorage.setItem("coastalai_session", JSON.stringify(session));
    else localStorage.removeItem("coastalai_session");
  }, [session]);

  async function login(email, password) {
    const { token, user } = await api.login(email, password);
    setSession({ token, user });
    return user;
  }

  function logout() {
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
