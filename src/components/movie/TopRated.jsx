import React from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { getTmdbImage } from '../../utils/tmdbImages';
import dummyPoster from '../../assets/Poster1.jpg';

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
            key={movie.tmdbId}
            id={movie.tmdbId}
            title={movie.title}
            year={movie.releaseYear || 'N/A'}
            rating={
              movie.rating !== null && movie.rating !== undefined
                ? Number(movie.rating).toFixed(1)
                : 'N/A'
            }
            type="Movie"
            poster={
              movie.posterPath ? getTmdbImage(movie.posterPath, 'w500') : dummyPoster
            }
          />
        ))}
      </div>
    </section>
  );
}

export default TopRated;