import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';

import MovieCard from '../../components/movie/MovieCard';
import { getWatchlist } from '../../services/watchlistService';
import { getTmdbImage } from '../../utils/tmdbImages';

function MyWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadWatchlist() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const result = await getWatchlist();

        setWatchlist(result.watchlist || []);
      } catch (error) {
        console.error('WATCHLIST LOAD ERROR:', error);

        setErrorMessage(
          error.message || 'Failed to load your watchlist.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadWatchlist();
  }, []);

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      <section className="container mx-auto px-6 pb-16 pt-32">

        <div className="mb-8">

          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Your collection
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            My Watchlist
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
            Movies and series you want to watch later.
          </p>

        </div>

        {isLoading && (
          <div className="py-20 text-center">

            <p className="text-sm text-[#93939A]">
              Loading your watchlist...
            </p>

          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="py-20 text-center">

            <i className="ri-error-warning-line text-3xl text-[#52525B]"></i>

            <p className="mt-4 text-sm text-[#93939A]">
              {errorMessage}
            </p>

          </div>
        )}

        {!isLoading && !errorMessage && watchlist.length > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

            {watchlist.map((item) => {
              const movie = item.movie;

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

        {!isLoading && !errorMessage && watchlist.length === 0 && (
          <div className="py-20 text-center">

            <i className="ri-bookmark-line text-3xl text-[#52525B]"></i>

            <p className="mt-4 text-sm text-[#93939A]">
              Your watchlist is empty.
            </p>

            <p className="mt-2 text-xs text-[#52525B]">
              Add movies or series to your watchlist and they will appear here.
            </p>

          </div>
        )}

      </section>

    </main>
  );
}

export default MyWatchlist;