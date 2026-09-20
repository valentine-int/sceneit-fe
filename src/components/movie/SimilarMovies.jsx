import React from 'react';

import MovieCard from './MovieCard';

import dummyPoster from '../../assets/Poster1.jpg';

function SimilarMovies() {

  const movies = [
    {
      id: 1,
      title: 'Forgotten',
      year: '2017',
      rating: '7.4',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 2,
      title: 'Burning',
      year: '2018',
      rating: '7.5',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 3,
      title: 'Parasite',
      year: '2019',
      rating: '8.5',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 4,
      title: 'The Wailing',
      year: '2016',
      rating: '7.4',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 5,
      title: 'Decision to Leave',
      year: '2022',
      rating: '7.3',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 6,
      title: 'Midnight',
      year: '2021',
      rating: '6.4',
      type: 'Movie',
      poster: dummyPoster
    }
  ];

  return (
    <section className="container mx-auto px-6 pb-16">

      {/* SECTION HEADER */}
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
          You might also like
        </p>

        <h2 className="mt-2 text-2xl font-bold sm:text-3xl text-[#F4F4F5]">
          Similar Films
        </h2>
      </div>

      {/* MOVIE GRID */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

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

export default SimilarMovies;
