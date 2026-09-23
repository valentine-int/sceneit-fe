import { useCallback } from 'react';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getPopularSeries,
  getMovieDetail,
} from '../services/movieService';
import useFetch from './useFetch';

function useHome() {
  const fetchHome = useCallback(async () => {
    const [trending, topRated, featuredMoviesData, featuredSeriesData] = await Promise.all([
      getTrendingMovies(),
      getTopRatedMovies(),
      getPopularMovies(),
      getPopularSeries(),
    ]);

    // =========================
    // FEATURED MOVIES
    // =========================
    const featuredMovies = (featuredMoviesData.results || []).slice(0, 3);
    const movieDetails = await Promise.all(
      featuredMovies.map((movie) => getMovieDetail(movie.tmdbId, 'movie'))
    );
    const formattedMovies = movieDetails.map((movie) => ({
      ...movie,
      type: 'Movie',
    }));

    // =========================
    // FEATURED SERIES
    // =========================
    const featuredSeries = (featuredSeriesData.results || []).slice(0, 2);
    const seriesDetails = await Promise.all(
      featuredSeries.map((series) => getMovieDetail(series.tmdbId, 'series'))
    );
    const formattedSeries = seriesDetails.map((series) => ({
      ...series,
      type: 'Series',
    }));

    // =========================
    // COMBINE MOVIE + SERIES
    // =========================
    const featured = [...formattedMovies, ...formattedSeries];

    return {
      trending,
      topRated,
      featured,
    };
  }, []);

  return useFetch(fetchHome);
}

export default useHome;