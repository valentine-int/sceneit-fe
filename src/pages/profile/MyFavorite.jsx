import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import MovieCard from '../../components/movie/MovieCard';
import { getFavorites } from '../../services/favoriteService';
import { getTmdbImage } from '../../utils/tmdbImages';
import dummyPoster from '../../assets/Poster1.jpg';

function MyFavorite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        setError('');
        const result = await getFavorites();
        setFavorites(result.favorites || []);
      } catch (err) {
        console.error('MY FAVORITE LOAD ERROR:', err);
        setError(err.message || 'Failed to load your favorites.');
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  return (
    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
      <section className="container mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Your collection
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Favorites
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
            Movies and series you've marked as favorite.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center">
            <i className="ri-loader-4-line animate-spin text-3xl text-[#93939A]"></i>
            <p className="mt-4 text-sm text-[#93939A]">Loading favorites...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="py-20 text-center">
            <i className="ri-error-warning-line text-3xl text-[#52525B]"></i>
            <p className="mt-4 text-sm text-[#93939A]">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && favorites.length === 0 && (
          <div className="py-20 text-center">
            <i className="ri-heart-line text-3xl text-[#52525B]"></i>
            <p className="mt-4 text-sm text-[#93939A]">
              You haven't added any favorites yet.
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {favorites.map((item) => (
              <MovieCard
                key={item.id}
                id={item.movie?.tmdbId}
                title={item.movie?.title}
                year={item.movie?.releaseYear || 'N/A'}
                rating={
                item.movie?.rating !== null &&
                item.movie?.rating !== undefined
                  ? Number(item.movie.rating).toFixed(1)
                  : 'N/A'
              }
                poster={
                  item.movie?.posterPath
                    ? getTmdbImage(item.movie.posterPath, 'w500')
                    : dummyPoster
                }
                type={item.movie?.type === 'series' ? 'Series' : 'Movie'}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyFavorite;