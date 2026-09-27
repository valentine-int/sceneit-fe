import { useCallback } from 'react';
import {
  getTrendingMovies,
  getTrendingSeries,
  getTopRatedMovies,
  getTopRatedSeries,
  getFeaturedContent,
} from '../services/movieService';
import useFetch from './useFetch';

function useHome() {
  const fetchHome = useCallback(async () => {
    const [
      trending,
      trendingSeries,
      topRated,
      topRatedSeries,
      featuredData,
    ] = await Promise.all([
      getTrendingMovies(),
      getTrendingSeries(),
      getTopRatedMovies(),
      getTopRatedSeries(),
      getFeaturedContent(),
    ]);

    return {
      trending,
      trendingSeries,
      topRated,
      topRatedSeries,
      featured: featuredData.featured || [],
    };
  }, []);

  return useFetch(fetchHome);
}

export default useHome;