import React from 'react';
import MovieCard from './MovieCard';
import { getTmdbImage } from '../../utils/tmdbImages';
import dummyPoster from '../../assets/Poster1.jpg';

function MovieGrid({
  movies = [],
  contentType = 'movie',
}) {
  const movieResults = movies.slice(0, 6);

  const isSeries = contentType === 'series';

  if (movieResults.length === 0) {
    return (
      <section className="container mx-auto px-6 py-10">
        <p className="text-sm text-[#93939A]">
          No trending {isSeries ? 'series' : 'movies'} available.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            What's trending
          </p>

          <h2 className="text-2xl font-bold text-[#F4F4F5] sm:text-3xl">
            Trending {isSeries ? 'Series' : 'Movies'}
          </h2>
        </div>
      </div>

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
            type={isSeries ? 'Series' : 'Movie'}
            poster={
              movie.posterPath
                ? getTmdbImage(movie.posterPath, 'w500')
                : dummyPoster
            }
          />
        ))}
      </div>
    </section>
  );
}

export default MovieGrid;