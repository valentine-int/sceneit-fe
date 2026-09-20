import React from 'react';
import MovieCard from './MovieCard';

import dummyPoster from '../../assets/Poster1.jpg';

function TopRated() {

  const movies = [
    {
      id: 1,
      title: "The Shawshank Redemption",
      year: "1994",
      rating: "9.3",
      type: "Movie",
      poster: dummyPoster
    },

    {
      id: 2,
      title: "The Godfather",
      year: "1972",
      rating: "9.2",
      type: "Movie",
      poster: dummyPoster
    },

    {
      id: 3,
      title: "The Dark Knight",
      year: "2008",
      rating: "9.0",
      type: "Movie",
      poster: dummyPoster
    },

    {
      id: 4,
      title: "Breaking Bad",
      year: "2008",
      rating: "9.5",
      type: "Series",
      poster: dummyPoster
    },

    {
      id: 5,
      title: "Interstellar",
      year: "2014",
      rating: "8.7",
      type: "Movie",
      poster: dummyPoster
    },

    {
      id: 6,
      title: "Parasite",
      year: "2019",
      rating: "8.5",
      type: "Movie",
      poster: dummyPoster
    }
  ];

  return (
    <section className="container mx-auto px-6 py-10">

      {/* SECTION HEADER */}
      <div className="flex items-end justify-between mb-6">

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A] mb-2">
            Highest rated
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">
            Top Rated
          </h2>
        </div>

        <button className="hidden sm:block text-sm font-medium text-[#93939A] hover:text-[#F4F4F5] transition-colors">
          See all
        </button>

      </div>

      {/* MOVIE GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">

        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            year={movie.year}
            rating={movie.rating}
            type={movie.type}
            poster={movie.poster}
          />
        ))}

      </div>

    </section>
  );
}

export default TopRated;