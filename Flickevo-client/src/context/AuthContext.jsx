import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, refreshSession } from "../services/authApi";
import { getProfile } from "../services/userApi";
import { setAccessToken, setStoredRefreshToken, getAccessToken, getStoredRefreshToken } from "../services/backendClient";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "flickevo_user";

export const AuthProvider = ({ children }) => {
  // Synchronously initialize user from localStorage to prevent logout flicker on reload
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        id: parsed.id || parsed._id,
        _id: parsed._id || parsed.id,
      };
    } catch {
      return null;
    }
  });

  const [checkingAuth, setCheckingAuth] = useState(() => {
    return !!(getAccessToken() || getStoredRefreshToken() || localStorage.getItem(USER_STORAGE_KEY));
  });

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const hasToken = getAccessToken();
      const hasRefresh = getStoredRefreshToken();

      if (!hasToken && !hasRefresh) {
        if (isMounted) setCheckingAuth(false);
        return;
      }

      try {
        let profile = null;

        // Try using existing accessToken first
        if (hasToken) {
          try {
            profile = await getProfile();
          } catch (err) {
            // If token expired (401) and we have refresh token, attempt refresh
            if (err.response?.status === 401 && hasRefresh) {
              await refreshSession();
              profile = await getProfile();
            } else {
              throw err;
            }
          }
        } else if (hasRefresh) {
          await refreshSession();
          profile = await getProfile();
        }

        if (isMounted && profile) {
          const normalized = {
            ...profile,
            id: profile.id || profile._id,
            _id: profile._id || profile.id,
          };
          setUser(normalized);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
        }
      } catch (err) {
        // ONLY clear auth if the backend explicitly rejected credentials with 401
        // If it's a network glitch or Render cold-start, retain user session from localStorage
        if (err.response?.status === 401) {
          console.warn("Session expired, resetting auth:", err);
          if (isMounted) {
            setAccessToken(null);
            setStoredRefreshToken(null);
            localStorage.removeItem(USER_STORAGE_KEY);
            setUser(null);
          }
        } else {
          console.warn("Network error or server waking up, retaining saved session:", err);
        }
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const loggedInUser = await loginUser(credentials);
    const normalized = {
      ...loggedInUser,
      id: loggedInUser.id || loggedInUser._id,
      _id: loggedInUser._id || loggedInUser.id,
    };
    setUser(normalized);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const register = async (details) => {
    const newUser = await registerUser(details);
    const normalized = {
      ...newUser,
      id: newUser.id || newUser._id,
      _id: newUser._id || newUser.id,
    };
    setUser(normalized);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      setAccessToken(null);
      setStoredRefreshToken(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const next = {
        ...prev,
        ...updatedData,
        id: updatedData?.id || updatedData?._id || prev?.id || prev?._id,
        _id: updatedData?._id || updatedData?.id || prev?._id || prev?.id,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const refreshUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
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