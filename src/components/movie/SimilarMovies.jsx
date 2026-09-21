import React, { useEffect, useState } from 'react';

import MovieCard from './MovieCard';
import { getSimilarMovies } from '../../services/tmdb';

function SimilarMovies({ movieId }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarMovies() {
      try {
        setLoading(true);

        const data = await getSimilarMovies(movieId);

        setMovies(data.results || []);
      } catch (error) {
        console.error(
          'TMDB SIMILAR MOVIES ERROR:',
          error
        );

        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    if (movieId) {
      fetchSimilarMovies();
    }
  }, [movieId]);

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

  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 pb-16">

      {/* HEADER */}

      <div className="mb-6">

        <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
          Discover
        </p>

        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          Similar Movies
        </h2>

      </div>


      {/* MOVIES */}

      <div
        className="flex gap-5 overflow-x-auto pb-3
                   [scrollbar-width:none]
                   [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden"
      >

        {movies.slice(0, 10).map((movie) => (

          <div
            key={movie.id}
            className="w-[160px] shrink-0 sm:w-[180px] md:w-[200px]"
          >

            <MovieCard
              id={movie.id}
              title={movie.title}
              year={
                movie.release_date
                  ? movie.release_date.slice(0, 4)
                  : 'N/A'
              }
              rating={
                movie.vote_average
                  ? movie.vote_average.toFixed(1)
                  : 'N/A'
              }
              poster={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/dummyPoster.png'
              }
              type="Movie"
            />

          </div>

        ))}

      </div>

    </section>
  );
}

export default SimilarMovies;
