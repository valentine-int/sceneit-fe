import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import MovieCard from '../../components/movie/MovieCard';
import { getWatched } from '../../services/watchedService';
import { getTmdbImage } from '../../utils/tmdbImages';

function MyWatched() {
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadWatched() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const result = await getWatched();

        setWatched(result.watched || []);
      } catch (error) {
        console.error('WATCHED LOAD ERROR:', error);

        setErrorMessage(
          error.message || 'Failed to load your watched movies.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadWatched();
  }, []);

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* HEADER */}

      <section className="container mx-auto px-6 pb-8 pt-32">

        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#93939A] transition-colors hover:text-[#F4F4F5]"
        >
          <i className="ri-arrow-left-s-line text-lg"></i>
          Profile
        </Link>

        <div className="flex items-end justify-between">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
              Your viewing history
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Watched
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
              Movies and series you have watched.
            </p>

          </div>

          {!isLoading && (
            <span className="hidden text-sm text-[#93939A] sm:block">
              {watched.length} titles
            </span>
          )}

        </div>

      </section>

      {/* WATCHED */}

      <section className="container mx-auto px-6 pb-20">

        {/* LOADING */}

        {isLoading && (
          <div className="py-20 text-center">

            <i className="ri-loader-4-line animate-spin text-3xl text-[#93939A]"></i>

            <p className="mt-4 text-sm text-[#93939A]">
              Loading your watched movies...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!isLoading && errorMessage && (
          <div className="py-20 text-center">

            <i className="ri-error-warning-line text-3xl text-[#93939A]"></i>

            <p className="mt-4 text-sm text-[#93939A]">
              {errorMessage}
            </p>

          </div>
        )}

        {/* MOVIES */}

        {!isLoading && !errorMessage && watched.length > 0 && (

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

            {watched.map((item) => {

              const movie = item.movie;

              if (!movie) {
                return null;
              }

              const poster = getTmdbImage(movie.posterPath);

              const type =
                movie.type === 'series'
                  ? 'Series'
                  : 'Movie';

              return (
                <MovieCard
                  key={item.id}
                  id={movie.tmdbId}
                  title={movie.title}
                  year={movie.releaseYear}
                  rating={movie.rating}
                  type={type}
                  poster={poster}
                />
              );
            })}

          </div>

        )}

        {/* EMPTY */}

        {!isLoading && !errorMessage && watched.length === 0 && (

          <div className="py-20 text-center">

            <i className="ri-checkbox-circle-line text-3xl text-[#52525B]"></i>

            <h2 className="mt-4 text-lg font-semibold">
              You haven't watched anything yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#93939A]">
              Movies and series you mark as watched will appear here.
            </p>

            <Link
              to="/movies"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F4F4F5] px-4 py-2.5 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7]"
            >
              Browse Movies
              <i className="ri-arrow-right-s-line"></i>
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}

export default MyWatched;