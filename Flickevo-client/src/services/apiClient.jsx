import axios from "axios";

const api = import.meta.env.VITE_TMDB_API;
const header = import.meta.env.VITE_HEADER;


const fetchApi = async (endpoint)=>
{
  try
  {
    const response = await axios.get(
      `${api}${endpoint}`,
      {
        headers: {
          Authorization: header,
          accept: "application/json",
        },
      }
    );
    return response;
  }
  catch(error)
  {
    console.log(error);
  }
}


export const getTrending = async () => {
    const response = await fetchApi("/trending/all/day");
    return response.data;
};

export const getToprated = async () => {
    const response = await fetchApi("/movie/top_rated?language=en-IN&region=IN");
    return response.data;
};

export const getPopular = async () => {
    const response = await fetchApi("/movie/now_playing?language=en-IN&region=IN");
    return response.data;
};

export const getUpcoming = async () => {
     const response = await fetchApi(
      "/discover/movie?language=en-IN&with_origin_country=IN&sort_by=popularity.desc"
    );
    return response.data;
};

//shows
export const getCurrentShows = async () => {
    const response = await fetchApi("/tv/airing_today");
    return response.data;
};

export const getTrendingShows = async () => {
    const response = await fetchApi("/trending/tv/day?language=en-US");
    return response.data;
};

export const getTopratedShows = async () => {
    const response = await fetchApi("/tv/top_rated?language=en-IN&page=1");
    return response.data;
};

export const getPopularShows = async () => {
    const response = await fetchApi(
      "/tv/popular?language=en-IN&with_origin_country=IN"
    );
    return response.data;
};

export const searchMovie = async (query) => {
  return await fetchApi(`/search/multi?query=${query}`);
};

export const searchById = async (id)=>
{
  const response = await fetchApi( `/movie/${id}`)
  return response; 
}

export const searchShowById = async (id)=>
{
  const response = await fetchApi( `/tv/${id}`)
  console.log(response.data)
  return response; 
}
