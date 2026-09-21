import { useCallback } from 'react';

import {
  getTrendingSeries,
  getPopularSeries,
  getTopRatedSeries,
  getAiringTodaySeries,
} from '../services/tmdb';

import useFetch from './useFetch';

function useSeries() {

  const fetchSeries = useCallback(async () => {

    const [
      trending,
      popular,
      topRated,
      airingToday,
    ] = await Promise.all([
      getTrendingSeries(),
      getPopularSeries(),
      getTopRatedSeries(),
      getAiringTodaySeries(),
    ]);

    return {
      trending,
      popular,
      topRated,
      airingToday,
    };
  }, []);

  return useFetch(fetchSeries);
}

export default useSeries;