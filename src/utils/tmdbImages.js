const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getTmdbImage(path, size = "w500") {
  if (!path) return null;

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
