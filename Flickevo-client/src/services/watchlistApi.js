import { backendApi } from "./backendClient";

export const fetchWatchlist = async () => {
  const { data } = await backendApi.get("/watchlist");
  return data.watchlist; // [{ _id, mediaId, mediaType, createdAt }]
};

export const addToWatchlistApi = async (mediaId, mediaType) => {
  const { data } = await backendApi.post("/watchlist", { mediaId, mediaType });
  return data.item;
};

export const removeFromWatchlistApi = async (watchlistEntryId) => {
  const { data } = await backendApi.delete(`/watchlist/${watchlistEntryId}`);
  return data;
};