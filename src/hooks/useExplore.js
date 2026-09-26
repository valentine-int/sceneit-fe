import { useEffect, useState } from 'react';
import { exploreContent } from '../services/movieService';
import { getGenres } from '../services/movieService';

function useExplore() {

  // FILTER STATE
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');

  // GENRE STATE
  const [genres, setGenres] = useState([]);
  const [movieGenres, setMovieGenres] = useState([]);
  const [seriesGenres, setSeriesGenres] = useState([]);

  // RESULT STATE
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // GET GENRES

  useEffect(() => {

    async function fetchGenres() {

      try {
        const [movieGenresData, seriesGenresData] = await Promise.all([
          getGenres('movie'),
          getGenres('series'),
        ]);
        const movieGenreList =
          movieGenresData.genres || [];

        const seriesGenreList =
          seriesGenresData.genres || [];

        setMovieGenres(movieGenreList);
        setSeriesGenres(seriesGenreList);

const combinedGenres = [
  ...movieGenreList.map((genre) => ({
    id: genre.id,
    name: genre.name,
    type: 'movie',
  })),

  ...seriesGenreList.map((genre) => ({
    id: genre.id,
    name: genre.name,
    type: 'series',
  })),
];

const uniqueGenres = Array.from(
  new Map(
    combinedGenres.map((item) => [
      `${item.name}-${item.type}`,
      item,
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

  // SEARCH
  const handleSearch = async () => {

  if (!search.trim()) {
    setResults([]);
    return;
  }

  try {

    setLoading(true);
    setError('');

const data = await exploreContent({
  query: search.trim(),
  type: type === 'tv' ? 'series' : type,
  genre,
  year,
  rating,
  page: 1,
});

    setResults(data.results || []);

  } catch (err) {

    console.error(
      'EXPLORE API ERROR:',
      err
    );

    setError(
      'Failed to search movies and series.'
    );

  } finally {

    setLoading(false);

  }

};

  // RESET
  const handleReset = () => {

    setSearch('');
    setType('');
    setGenre('');
    setYear('');
    setRating('');

    setResults([]);
    setError('');

  };


const availableGenres =
  type === 'movie'
    ? movieGenres.map((item) => ({
        id: item.id,
        name: item.name,
        type: 'movie',
      }))
    : type === 'series'
      ? seriesGenres.map((item) => ({
          id: item.id,
          name: item.name,
          type: 'series',
        }))
      : genres;

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
  availableGenres,

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

