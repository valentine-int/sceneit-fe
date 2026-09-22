import { useCallback } from 'react';

import {
  getSimilarContent,
} from '../services/movieService';

import useFetch from './useFetch';

function useSimilarSeries(seriesId) {

  const fetchSimilarSeries = useCallback(async () => {

    if (!seriesId) {
      throw new Error('Series ID is required.');
    }

    const data =
      await getSimilarContent(seriesId, 'series');

    return data.results || [];

  }, [seriesId]);

  return useFetch(fetchSimilarSeries);
}

export default useSimilarSeries;