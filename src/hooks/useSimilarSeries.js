import { useCallback } from 'react';

import {
  getSimilarSeries,
} from '../services/tmdb';

import useFetch from './useFetch';

function useSimilarSeries(seriesId) {

  const fetchSimilarSeries = useCallback(async () => {

    if (!seriesId) {
      throw new Error('Series ID is required.');
    }

    const data =
      await getSimilarSeries(seriesId);

    return data.results || [];

  }, [seriesId]);

  return useFetch(fetchSimilarSeries);
}

export default useSimilarSeries;
