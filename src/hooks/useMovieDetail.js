import { useCallback } from 'react';

import { getMovieDetail } from '../services/movieService';

import useFetch from './useFetch';

function useMovieDetail(id, type = 'movie') {

  const fetchMovieDetail = useCallback(() => {

    if (!id) {
      throw new Error('Movie ID is required.');
    }

    return getMovieDetail(id, type);

  }, [id, type]);

  return useFetch(fetchMovieDetail);
}

export default useMovieDetail;