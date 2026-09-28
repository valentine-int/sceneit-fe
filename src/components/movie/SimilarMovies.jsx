import React, { useRef } from 'react';

import MovieCard from './MovieCard';

import { getSimilarContent } from '../../services/movieService';
import { getTmdbImage } from '../../utils/tmdbImages';
import dummyPoster from '../../assets/Poster1.jpg';

function SimilarMovies({ movieId }) {
  const [movies, setMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const carouselRef = useRef(null);

  React.useEffect(() => {
    async function fetchSimilarMovies() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getSimilarContent(movieId, 'movie');

        setMovies(data.results || []);
      } catch (error) {
        console.error(
          'SIMILAR MOVIES ERROR:',
          error
        );

        setMovies([]);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (movieId) {
      fetchSimilarMovies();
    } else {
      setMovies([]);
      setLoading(false);
    }
  }, [movieId]);

  const scrollCarousel = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction === 'left' ? -900 : 900,
      behavior: 'smooth',
    });
  };

  // LOADING
  if (loading) {
    return (
      <section className="container mx-auto px-6 pb-16">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Discover
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Similar Movies
          </h2>
        </div>

        <p className="text-sm text-[#93939A]">
          Loading similar movies...
        </p>
      </section>
    );
  }

  // ERROR
  if (error) {
    return null;
  }

  // EMPTY
  if (movies.length === 0) {
    return null;
  }

  // PAGE
  return (
    <section className="container mx-auto px-6 pb-16">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
          Discover
        </p>

        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          Similar Movies
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* LEFT */}
        <button
          type="button"
          onClick={() => scrollCarousel('left')}
          className="shrink-0 text-3xl text-[#F4F4F5] transition-transform hover:scale-125"
          aria-label="Previous similar movies"
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>

        {/* MOVIES */}
        <div
          ref={carouselRef}
          className="flex min-w-0 gap-5 overflow-x-auto pb-2
                     [scrollbar-width:none]
                     [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
        >
          {movies.slice(0, 10).map((movie) => (
            <div
              key={movie.tmdbId}
              className="w-[160px] shrink-0 sm:w-[180px] md:w-[200px]"
            >
              <MovieCard
                id={movie.tmdbId}
                title={movie.title}
                year={movie.releaseYear || 'N/A'}
                rating={
                  movie.rating !== null &&
                  movie.rating !== undefined
                    ? Number(movie.rating).toFixed(1)
                    : 'N/A'
                }
                poster={
                  movie.posterPath
                    ? getTmdbImage(movie.posterPath, 'w500')
                    : dummyPoster
                }
                type="Movie"
              />
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <button
          type="button"
          onClick={() => scrollCarousel('right')}
          className="shrink-0 text-3xl text-[#F4F4F5] transition-transform hover:scale-125"
          aria-label="Next similar movies"
        >
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </section>
  );
}

export default SimilarMovies;