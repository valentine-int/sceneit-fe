import { useCallback } from 'react';

import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
} from '../services/movieService';

import useFetch from './useFetch';

function useMovies() {

  const fetchMovies = useCallback(async () => {

    const [
      trending,
      popular,
      topRated,
      nowPlaying,
    ] = await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getNowPlayingMovies(),
    ]);

    return {
      trending,
      popular,
      topRated,
      nowPlaying,
    };

  }, []);

  return useFetch(fetchMovies);
}

export default useMovies;