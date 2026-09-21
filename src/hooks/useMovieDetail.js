import { useCallback } from 'react';

import {
  getMovieDetail,
  getMovieCredits,
} from '../services/tmdb';

import useFetch from './useFetch';

function useMovieDetail(id) {

  const fetchMovieDetail = useCallback(async () => {

    if (!id) {
      throw new Error('Movie ID is required.');
    }

    const [
      movieData,
      creditsData,
    ] = await Promise.all([
      getMovieDetail(id),
      getMovieCredits(id),
    ]);

    const cast = (creditsData.cast || [])
      .slice(0, 10)
      .map((actor) => ({
        id: actor.id,
        name: actor.name,
        role: actor.character,
        image: actor.profile_path
          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
          : null,
      }));

    return {
      movie: movieData,
      cast,
    };

  }, [id]);

  return useFetch(fetchMovieDetail);
}

export default useMovieDetail;