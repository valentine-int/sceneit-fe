import React from 'react';
import MovieCard from './MovieCard';

import dummyPoster from '../../assets/Poster1.jpg';

function MovieGrid() {

  const movies = [
    {
      id: 1,
      title: "Dune: Part Two",
      year: "2024",
      rating: "8.7",
      type: "Movie",
      poster: dummyPoster
    },

    {
      id: 2,
      title: "Interstellar",
      year: "2014",
      rating: "8.7",
      type: "Movie",
      poster: dummyPoster
    },

    {
      id: 3,
      title: "Stranger Things",
      year: "2016",
      rating: "8.6",
      type: "Series",
      poster: dummyPoster
    },

    {
      id: 4,
      title: "The Batman",
      year: "2022",
      rating: "7.8",
      type: "Movie",
      poster: dummyPoster
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">

      {movies.map((movie) => {
        return (
          <MovieCard
            key={movie.id}
            title={movie.title}
            year={movie.year}
            rating={movie.rating}
            type={movie.type}
            poster={movie.poster}
          />
        );
      })}

    </div>
  );
}

export default MovieGrid;