import { useEffect, useState } from 'react';

import {
  searchMulti,
  getMovieGenres,
  getSeriesGenres,
} from '../services/tmdb';

function useExplore() {

  // =========================
  // FILTER STATE
  // =========================

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');

  // =========================
  // GENRE STATE
  // =========================

  const [genres, setGenres] = useState([]);
  const [movieGenres, setMovieGenres] = useState([]);
  const [seriesGenres, setSeriesGenres] = useState([]);

  // =========================
  // RESULT STATE
  // =========================

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // =========================
  // GET GENRES
  // =========================

  useEffect(() => {

    async function fetchGenres() {

      try {

        const [
          movieGenresData,
          seriesGenresData,
        ] = await Promise.all([
          getMovieGenres(),
          getSeriesGenres(),
        ]);

        const movieGenreList =
          movieGenresData.genres || [];

        const seriesGenreList =
          seriesGenresData.genres || [];

        setMovieGenres(movieGenreList);
        setSeriesGenres(seriesGenreList);

        const combinedGenres = [
          ...movieGenreList,
          ...seriesGenreList,
        ];

        const uniqueGenres = Array.from(
          new Map(
            combinedGenres.map((item) => [
              item.name,
              item.name,
            ])
          ).values()
        );

        setGenres(uniqueGenres);

      } catch (err) {

        console.error(
          'TMDB GENRE ERROR:',
          err
        );

        setError('Failed to load genres.');

      }

    }

    fetchGenres();

  }, []);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = async () => {

    if (!search.trim()) {

      setResults([]);
      return;

    }

    try {

      setLoading(true);
      setError('');

      const data = await searchMulti(search);

      const filteredResults =
        (data.results || []).filter((item) => {

          // Only Movie & Series
          const validType =
            item.media_type === 'movie' ||
            item.media_type === 'tv';

          // Type
          const matchesType =
            type === '' ||
            item.media_type === type;

          // Genre
          const currentGenres =
            item.media_type === 'movie'
              ? movieGenres
              : seriesGenres;

          const selectedGenre =
            currentGenres.find(
              (itemGenre) =>
                itemGenre.name === genre
            );

          const matchesGenre =
            genre === '' ||
            item.genre_ids?.includes(
              selectedGenre?.id
            );

          // Year
          const itemYear =
            item.media_type === 'movie'
              ? item.release_date?.slice(0, 4)
              : item.first_air_date?.slice(0, 4);

          const matchesYear =
            year === '' ||
            itemYear === year;

          // Rating
          const matchesRating =
            rating === '' ||
            (item.vote_average || 0) >=
              Number(rating);

          return (
            validType &&
            matchesType &&
            matchesGenre &&
            matchesYear &&
            matchesRating
          );

        });

      setResults(filteredResults);

    } catch (err) {

      console.error(
        'TMDB SEARCH ERROR:',
        err
      );

      setError(
        'Failed to search movies and series.'
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // RESET
  // =========================

  const handleReset = () => {

    setSearch('');
    setType('');
    setGenre('');
    setYear('');
    setRating('');

    setResults([]);
    setError('');

  };

  return {

    // Search & filters
    search,
    setSearch,

    type,
    setType,

    genre,
    setGenre,

    year,
    setYear,

    rating,
    setRating,

    // Genres
    genres,

    // Results
    results,

    // State
    loading,
    error,

    // Actions
    handleSearch,
    handleReset,
  };
}

export default useExplore;