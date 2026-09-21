import { useCallback } from 'react';

import {
  getTrendingMovies,
  getTopRatedMovies,
  getFeaturedMovies,
  getMovieDetail,
  getPopularSeries,
  getSeriesDetail,
} from '../services/tmdb';

import useFetch from './useFetch';

function useHome() {

  const fetchHome = useCallback(async () => {

    const [
      trending,
      topRated,
      featuredMoviesData,
      featuredSeriesData,
    ] = await Promise.all([
      getTrendingMovies(),
      getTopRatedMovies(),
      getFeaturedMovies(),
      getPopularSeries(),
    ]);

    // =========================
    // FEATURED MOVIES
    // =========================

    const featuredMovies = (featuredMoviesData.results || [])
      .slice(0, 3);

    const movieDetails = await Promise.all(
      featuredMovies.map((movie) =>
        getMovieDetail(movie.id)
      )
    );

    const formattedMovies = movieDetails.map((movie) => ({
      ...movie,
      type: 'Movie',
    }));

    // =========================
    // FEATURED SERIES
    // =========================

    const featuredSeries = (featuredSeriesData.results || [])
      .slice(0, 2);

    const seriesDetails = await Promise.all(
      featuredSeries.map((series) =>
        getSeriesDetail(series.id)
      )
    );

    const formattedSeries = seriesDetails.map((series) => ({
      ...series,
      type: 'Series',
    }));

    // =========================
    // COMBINE MOVIE + SERIES
    // =========================

    const featured = [
      ...formattedMovies,
      ...formattedSeries,
    ];

    return {
      trending,
      topRated,
      featured,
    };
  }, []);

  return useFetch(fetchHome);
}

export default useHome;