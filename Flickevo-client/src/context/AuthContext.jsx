import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, refreshSession } from "../services/authApi";
import { getProfile } from "../services/userApi";
import { setAccessToken } from "../services/backendClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        await refreshSession();
        const profile = await getProfile();
        setUser(profile);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (credentials) => {
    const loggedInUser = await loginUser(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (details) => {
    const newUser = await registerUser(details);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const refreshUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
      return profile;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, checkingAuth, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);