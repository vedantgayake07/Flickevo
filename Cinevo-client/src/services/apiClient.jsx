import axios from "axios";

const api = import.meta.env.VITE_TMDB_API;
const header = import.meta.env.VITE_HEADER;

export const getPopular = async () => {
  try {
    const response = await axios.get(
      `${api}/trending/movie/day?language=en-US`,
      {
        headers: {
          Authorization: header,
          accept: "application/json",
        },
      }
    );
    return response.data;

  } catch (error) {
    console.log(error);
  }
};