import React from 'react';
import { Link } from 'react-router-dom';

import MovieCard from './MovieCard';

function TopRated({ movies = [] }) {

  const movieResults = movies.slice(0, 6);

  if (movieResults.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 py-10">

      {/* SECTION HEADER */}
      <div className="mb-6 flex items-end justify-between">

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Highly rated
          </p>

          <h2 className="text-2xl font-bold text-[#F4F4F5] sm:text-3xl">
            Top Rated
          </h2>
        </div>

        <Link
          to="/movies"
          className="text-2xl text-[#93939A] transition-colors hover:text-[#F4F4F5]"
          aria-label="View all top rated movies"
        >
          <i className="ri-arrow-right-s-line"></i>
        </Link>

      </div>

      {/* MOVIE GRID */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

        {movieResults.map((movie) => (

          <MovieCard
            key={movie.id}
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
            type="Movie"
            poster={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/dummyPoster.png'
            }
          />

        ))}

      </div>

    </section>
  );
}

export default TopRated;