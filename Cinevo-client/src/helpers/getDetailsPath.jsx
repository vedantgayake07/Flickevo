const getDetailsPath = (item) => {
  switch (item.media_type) {
    case "movie":
      return `/movies/${item.id}`;

    case "tv":
      return `/shows/${item.id}`;

    default:
      return "/";
  }
};

export default getDetailsPath;