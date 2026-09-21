import { useCallback } from 'react';

import {
  getSeriesDetail,
  getSeriesCredits,
} from '../services/tmdb';

import useFetch from './useFetch';

function useSeriesDetail(id) {

  const fetchSeriesDetail = useCallback(async () => {

    if (!id) {
      throw new Error('Series ID is required.');
    }

    const [
      seriesData,
      creditsData,
    ] = await Promise.all([
      getSeriesDetail(id),
      getSeriesCredits(id),
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
      series: seriesData,
      cast,
    };

  }, [id]);

  return useFetch(fetchSeriesDetail);
}

export default useSeriesDetail;