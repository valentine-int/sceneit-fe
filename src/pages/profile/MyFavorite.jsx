import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import MovieCard from '../../components/movie/MovieCard';
import { getFavorites } from '../../utils/sceneitStorage';

function MyFavorite() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = getFavorites();

    setFavorites(savedFavorites);
  }, []);

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* =========================
          HEADER
      ========================= */}

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
              Your favorites
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Favorite
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
              Movies and series you have liked.
            </p>

          </div>

          <span className="hidden text-sm text-[#93939A] sm:block">
            {favorites.length} titles
          </span>

        </div>

      </section>

      {/* =========================
          FAVORITES
      ========================= */}

      <section className="container mx-auto px-6 pb-20">

        {favorites.length > 0 ? (

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

            {favorites.map((movie) => (

              <MovieCard
                key={`${movie.type}-${movie.id}`}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                type={movie.type}
                poster={movie.poster}
              />

            ))}

          </div>

        ) : (

          <div className="py-20 text-center">

            <i className="ri-heart-line text-3xl text-[#52525B]"></i>

            <h2 className="mt-4 text-lg font-semibold">
              No favorites yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#93939A]">
              Like movies and series you love and they will appear here.
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

export default MyFavorite;