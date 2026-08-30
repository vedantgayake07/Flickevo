// Function to get media type dynamically
export const getMediaType = (item) => {
  if (item.media_type) return item.media_type;
  return item.title || item.release_date ? 'movie' : 'tv';
};


