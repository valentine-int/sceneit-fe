import { useCallback } from 'react';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getFeaturedContent,
} from '../services/movieService';
import useFetch from './useFetch';

function useHome() {
  const fetchHome = useCallback(async () => {
    const [trending, topRated, featuredData] = await Promise.all([
      getTrendingMovies(),
      getTopRatedMovies(),
      getFeaturedContent(),
    ]);

    return {
      trending,
      topRated,
      featured: featuredData.featured || [],
    };
  }, []);

  return useFetch(fetchHome);
}

export default useHome;