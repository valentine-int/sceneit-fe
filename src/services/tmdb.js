const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';


// =========================
// TMDB REQUEST
// =========================

async function requestTMDB(endpoint) {

  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: 'application/json',
      },
    }
  );

  if (!response.ok) {

    let errorMessage =
      `TMDB Error ${response.status}`;

    try {

      const errorData = await response.json();

      console.error(
        'TMDB RESPONSE:',
        errorData
      );

      if (errorData.status_message) {
        errorMessage +=
          `: ${errorData.status_message}`;
      }

    } catch {
      // Keep default error message
    }

    throw new Error(errorMessage);
  }

  return response.json();
}


// =========================
// MOVIES
// =========================

export async function getTrendingMovies() {
  return requestTMDB(
    '/trending/movie/week'
  );
}

export async function getPopularMovies() {
  return requestTMDB(
    '/movie/popular'
  );
}

export async function getMovieDetail(movieId) {
  return requestTMDB(
    `/movie/${movieId}`
  );
}

export async function getMovieCredits(movieId) {
  return requestTMDB(
    `/movie/${movieId}/credits`
  );
}

export async function getSimilarMovies(movieId) {
  return requestTMDB(
    `/movie/${movieId}/similar`
  );
}

export async function getTopRatedMovies() {
  return requestTMDB(
    '/movie/top_rated'
  );
}

export async function getNowPlayingMovies() {
  return requestTMDB(
    '/movie/now_playing'
  );
}


// =========================
// SERIES
// =========================

export async function getTrendingSeries() {
  return requestTMDB(
    '/trending/tv/week'
  );
}

export async function getPopularSeries() {
  return requestTMDB(
    '/tv/popular'
  );
}

export async function getTopRatedSeries() {
  return requestTMDB(
    '/tv/top_rated'
  );
}

export async function getAiringTodaySeries() {
  return requestTMDB(
    '/tv/airing_today'
  );
}

export async function getSeriesDetail(seriesId) {
  return requestTMDB(
    `/tv/${seriesId}`
  );
}

export async function getSeriesCredits(seriesId) {
  return requestTMDB(
    `/tv/${seriesId}/credits`
  );
}

export async function getSimilarSeries(seriesId) {
  return requestTMDB(
    `/tv/${seriesId}/similar`
  );
}


// =========================
// SEARCH
// =========================

export async function searchMulti(query) {

  return requestTMDB(
    `/search/multi?query=${encodeURIComponent(query)}`
  );

}


// =========================
// GENRES
// =========================

export async function getMovieGenres() {

  return requestTMDB(
    '/genre/movie/list'
  );

}

export async function getSeriesGenres() {

  return requestTMDB(
    '/genre/tv/list'
  );

}


// =========================
// FEATURED
// =========================

export async function getFeaturedMovies() {

  return requestTMDB(
    '/movie/popular'
  );

}