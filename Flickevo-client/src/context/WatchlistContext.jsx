/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  fetchWatchlist,
  addToWatchlistApi,
  removeFromWatchlistApi,
} from "../services/watchlistApi";
import { useAuth } from "./AuthContext";

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // [{ _id, mediaId, mediaType }]
  const [loaded, setLoaded] = useState(false);

  const loadWatchlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoaded(true);
      return;
    }
    try {
      const data = await fetchWatchlist();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const getEntry = (mediaId, mediaType) =>
    items.find((i) => i.mediaId === Number(mediaId) && i.mediaType === mediaType);

  const isInWatchlist = (mediaId, mediaType) => !!getEntry(mediaId, mediaType);

  const toggleWatchlist = async (mediaId, mediaType) => {
    const existing = getEntry(mediaId, mediaType);

    if (existing) {
      await removeFromWatchlistApi(existing._id);
      setItems((prev) => prev.filter((i) => i._id !== existing._id));
    } else {
      const item = await addToWatchlistApi(mediaId, mediaType);
      setItems((prev) => [item, ...prev]);
    }
  };

  return (
    <WatchlistContext.Provider value={{ items, loaded, isInWatchlist, toggleWatchlist, reload: loadWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);