import { useCallback } from 'react';
import { getMovieDetail } from '../services/movieService';
import useFetch from './useFetch';

function useSeriesDetail(id) {

  const fetchSeriesDetail = useCallback(() => {

    if (!id) {
      throw new Error('Series ID is required.');
    }

    return getMovieDetail(id, 'series');

  }, [id]);

  return useFetch(fetchSeriesDetail);
}

export default useSeriesDetail;