import { apiRequest } from './api';

export function searchMovies(query, page = 1) {
  const params = new URLSearchParams({
    query,
    type: 'movie',
    page,
  });

  return apiRequest(`/api/movies?${params.toString()}`);
}

export function searchSeries(query, page = 1) {
  const params = new URLSearchParams({
    query,
    type: 'series',
    page,
  });

  return apiRequest(`/api/movies?${params.toString()}`);
}

export function getMovieDetail(id, type = 'movie') {
  return apiRequest(
    `/api/movies/${id}?type=${type}`
  );
}

export function getSimilarContent(id, type = 'movie') {
  const params = new URLSearchParams({
    type,
  });

  return apiRequest(
    `/api/movies/${id}/similar?${params.toString()}`
  );
}

export function getTrendingMovies(page = 1) {
  return apiRequest(
    `/api/movies/trending?page=${page}`
  );
}

export function getPopularMovies(page = 1) {
  return apiRequest(
    `/api/movies/popular?page=${page}`
  );
}

export function getTopRatedMovies(page = 1) {
  return apiRequest(
    `/api/movies/top-rated?page=${page}`
  );
}

export function getNowPlayingMovies(page = 1) {
  return apiRequest(
    `/api/movies/now-playing?page=${page}`
  );
}

export function getTrendingSeries(page = 1) {
  return apiRequest(
    `/api/movies/trending-series?page=${page}`
  );
}

export function getPopularSeries(page = 1) {
  return apiRequest(
    `/api/movies/popular-series?page=${page}`
  );
}

export function getTopRatedSeries(page = 1) {
  return apiRequest(
    `/api/movies/top-rated-series?page=${page}`
  );
}

export function getAiringTodaySeries(page = 1) {
  return apiRequest(
    `/api/movies/airing-today-series?page=${page}`
  );
}

export function exploreContent({
  query,
  type = '',
  genre = '',
  year = '',
  rating = '',
  page = 1,
}) {
  const params = new URLSearchParams();

  if (query) params.set('query', query);
  if (type) params.set('type', type);
  if (genre) params.set('genre', genre);
  if (year) params.set('year', year);
  if (rating) params.set('rating', rating);

  params.set('page', String(page));

  return apiRequest(
    `/api/movies/explore?${params.toString()}`
  );
}